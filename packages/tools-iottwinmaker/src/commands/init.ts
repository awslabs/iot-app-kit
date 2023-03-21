import type { Arguments, CommandBuilder } from 'yargs';

import { getDefaultAwsClients as aws, initDefaultAwsClients } from '../lib/aws-clients';
import * as fs from 'fs';
import * as path from 'path';
import {
  ListComponentTypesCommandOutput,
  ListScenesCommandOutput,
  ListEntitiesCommandOutput,
  GetEntityCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { verifyWorkspaceExists } from '../lib/utils';

export type Options = {
  region: string;
  'workspace-id': string;
  out: string;
};

export type tmdk_config_file = {
  version: string;
  component_types: string[];
  scenes: string[];
  models: string[];
  entities: string;
};

export const command = 'init';
export const desc = 'Initializes a tmdk application';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    region: {
      type: 'string',
      require: true,
      description: 'Specify the AWS region of the Workspace to bootstrap the project from.',
    },
    'workspace-id': {
      type: 'string',
      require: true,
      description: 'Specify the ID of the Workspace to bootstrap the project from.',
    },
    out: {
      type: 'string',
      require: true,
      description: 'Specify the directory to initialize a project in.',
    },
  });

async function import_component_types(workspaceIdStr: string, tmdk_config: tmdk_config_file, outDir: string) {
  let nextToken: string | undefined = '';
  while (nextToken != undefined) {
    const listComponentsResp: ListComponentTypesCommandOutput = await aws().tm.listComponentTypes({
      workspaceId: workspaceIdStr,
      nextToken: nextToken,
    });
    nextToken = listComponentsResp['nextToken'];
    const componentTypeSummaries = listComponentsResp['componentTypeSummaries'];
    if (componentTypeSummaries != undefined) {
      for (const componentTypeSummary of componentTypeSummaries) {
        if (!componentTypeSummary.arn?.includes('AmazonOwnedTypesWorkspace')) {
          console.log(`saving component type: ${componentTypeSummary.componentTypeId} ...`);

          const getComponentResp = await aws().tm.getComponentType({
            workspaceId: workspaceIdStr,
            componentTypeId: componentTypeSummary.componentTypeId,
          });

          const componentDefinition = {
            componentTypeId: getComponentResp['componentTypeId'],
            description: getComponentResp['description'],
            extendsFrom: getComponentResp['extendsFrom'],
            functions: getComponentResp['functions'], // FIXME remove inherited values
            isSingleton: getComponentResp['isSingleton'],
            propertyDefinitions: getComponentResp['propertyDefinitions'],
            // 'tags': compResp['tags'] // FIXME type issue with tags?
          };

          // save to file
          fs.writeFileSync(
            path.join(outDir, `${getComponentResp['componentTypeId']}.json`),
            JSON.stringify(componentDefinition, null, 4)
          );

          tmdk_config['component_types'].push(`${getComponentResp['componentTypeId']}.json`);
        }
      }
    }
  }
  // save each non-pre-defined types into files
  fs.writeFileSync(path.join(outDir, 'tmdk.json'), JSON.stringify(tmdk_config, null, 4));
  return tmdk_config;
}

async function import_scenes_and_models(workspaceIdStr: string, tmdk_config: tmdk_config_file, outDir: string) {
  let nextToken: string | undefined = '';
  while (nextToken != undefined) {
    const listScenesResp: ListScenesCommandOutput = await aws().tm.listScenes({
      workspaceId: workspaceIdStr,
      nextToken: nextToken,
    });
    nextToken = listScenesResp['nextToken'];
    const sceneSummaries = listScenesResp['sceneSummaries'];
    let contentBucket = ''; // FIXME should be from workspace not scene files
    if (sceneSummaries != undefined) {
      const modelFiles = new Set();
      for (const sceneSummary of sceneSummaries) {
        // TODO consider putting models under scenes to support selective import
        const s3ContentLocation = sceneSummary.contentLocation;
        if (s3ContentLocation != undefined) {
          contentBucket = s3ContentLocation.substring(5).split('/')[0];
          const contentKey = s3ContentLocation.substring(5).split('/').slice(1).join('/');
          console.log(`saving scene file: ${contentKey}`);

          const data = await aws().s3.getObject({
            Bucket: contentBucket,
            Key: contentKey,
          });
          if (!data.Body) {
            throw new Error(`Error reading from s3 for bucket ${contentBucket} and key ${contentKey}`);
          }
          const sceneJson = JSON.parse(await data.Body.transformToString('utf-8'));
          for (const n of sceneJson['nodes']) {
            for (const c of n['components']) {
              if (c['type'] == 'ModelRef') {
                modelFiles.add(c['uri']);

                if (c['uri'].startsWith('s3://')) {
                  // handle case where URI is like "s3://bucket/key.glb"
                  c['uri'] = c['uri'].split('/').slice(3).join('/'); // change to relative s3 uri path
                }
                if (path.extname(c['uri']) == '.json') {
                  // Find URI of all models in JSON
                  // Obtain bucket name
                  let s3key = c['uri'] as string;
                  let s3bucket: string;
                  if (s3key.startsWith('s3://')) {
                    s3bucket = s3key.split('/')[2];
                    s3key = s3key.split('/').slice(3).join('/');
                  } else {
                    s3bucket = contentBucket;
                  }
                  // Obtain path of folder for JSON and download all files in that folder in the S3 bucket
                  const prefix = c['uri'].replace(path.basename(c['uri']), '');
                  const objlist = await aws().s3.listObjectsV2({
                    Bucket: s3bucket,
                    Prefix: prefix,
                  });
                  if (objlist['Contents'] != undefined) {
                    const contents = objlist['Contents'];
                    for (const [, value] of Object.entries(contents)) {
                      if ('Key' in value) {
                        // TODO consider path.join in all s3 URI for better cross platform support?
                        modelFiles.add(`s3://${s3bucket}/${value['Key']}`);
                      }
                    }
                  }
                }
              }
            }
          }

          // detect model files that absolute s3 path, update them to relative to support self-contained snapshot
          fs.writeFileSync(path.join(outDir, contentKey), JSON.stringify(sceneJson, null, 4)); // TODO handle non-root scene files?
          tmdk_config['scenes'].push(contentKey);
        }
      } // for each scene summary

      if (modelFiles.size > 0) {
        if (!fs.existsSync(path.join(outDir, '3d_models'))) {
          fs.mkdirSync(path.join(outDir, '3d_models'));
        }
      }

      for (const value of modelFiles) {
        console.log(`saving model file: ${value} ...`);
        let s3key = value as string;
        let s3bucket: string;
        if (s3key.startsWith('s3://')) {
          // handle case where URI is like "s3://bucket/key.glb"
          s3bucket = s3key.split('/')[2];
          s3key = s3key.split('/').slice(3).join('/');
        } else {
          // handle case where URI is relative to workspace content root like "CookieFactoryEnvironment.glb"
          s3bucket = contentBucket;
        }

        // FIXME - verify if need to handle the case where the scene file points to refs in other s3 buckets...should then modify the scene file during init?

        // handle case where s3 model file is in a sub-directory of the workspace bucket
        if (s3key.includes('/')) {
          const splitKey = s3key.split('/').slice(0, -1);
          console.log(`${s3key} -> ${splitKey}`);

          const dir_path = path.join(outDir, '3d_models');
          for (let index = 0; index < splitKey.length; index++) {
            const subpath = `${splitKey.slice(0, index + 1).join('/')}`;
            if (!fs.existsSync(path.join(outDir, subpath))) {
              console.log(`making path: ${dir_path}/${subpath} ...`);
              fs.mkdirSync(path.join(outDir, subpath));
            }
          }
        }

        const data = await aws().s3.getObject({ Bucket: s3bucket, Key: s3key });
        const bodyContents = (await data.Body?.transformToString('utf-8')) as string;
        fs.writeFileSync(path.join(outDir, '3d_models', s3key), bodyContents);
        tmdk_config['models'].push(s3key);

        // handle binary data references in gltf files - https://www.khronos.org/files/gltf20-reference-guide.pdf
        if (s3key.endsWith('.gltf')) {
          const gltfData = JSON.parse(bodyContents);
          if (gltfData['buffers']) {
            for (const buffer of gltfData['buffers']) {
              if (!(buffer['uri'] as string).startsWith('data:')) {
                const binRelativePath = `${(value as string).split('/').slice(0, -1).join('/')}/${buffer['uri']}`;

                console.log(`  saving referenced bin file: ${binRelativePath} ...`);
                const binS3bucket = binRelativePath.split('/')[2];
                const binS3key = binRelativePath.split('/').slice(3).join('/');
                const binData = await aws().s3.getObject({
                  Bucket: binS3bucket,
                  Key: binS3key,
                });
                const binBodyContents = (await binData.Body?.transformToString('utf-8')) as string;
                fs.writeFileSync(path.join(outDir, '3d_models', binS3key), binBodyContents);
                tmdk_config['models'].push(binS3key);
              }
            }
          }

          if (gltfData['images']) {
            for (const image of gltfData['images']) {
              if (!(image['uri'] as string).startsWith('data:')) {
                const binRelativePath = `${(value as string).split('/').slice(0, -1).join('/')}/${image['uri']}`;

                console.log(`saving referenced gltf bin file: ${binRelativePath} ...`);
                const binS3bucket = binRelativePath.split('/')[2];
                const binS3key = binRelativePath.split('/').slice(3).join('/');
                const binData = await aws().s3.getObject({
                  Bucket: binS3bucket,
                  Key: binS3key,
                });
                const binBodyContents = (await binData.Body?.transformToString('utf-8')) as string;
                fs.writeFileSync(path.join(outDir, '3d_models', binS3key), binBodyContents);
                tmdk_config['models'].push(binS3key);
              }
            }
          }
        }
      }
      // save each non-pre-defined types into files
      fs.writeFileSync(path.join(outDir, 'tmdk.json'), JSON.stringify(tmdk_config, null, 4));
    }
  }
  return tmdk_config;
}

async function import_entities(workspaceId: string, tmdk_config: tmdk_config_file, outDir: string) {
  const entities = [];
  let nextToken: string | undefined = '';
  let listEntitiesResp: ListEntitiesCommandOutput;
  let entityCount = 0;
  while (nextToken != undefined) {
    listEntitiesResp = await aws().tm.listEntities({
      workspaceId,
      nextToken: nextToken,
    });
    nextToken = listEntitiesResp['nextToken'];
    const entitySummaries = listEntitiesResp['entitySummaries'];
    if (entitySummaries != undefined) {
      for (const entitySummary of entitySummaries) {
        entityCount += 1;
        console.log(`Saving entity (${entityCount} saved so far): ${entitySummary.entityId} ... `);
        const entityDetails: GetEntityCommandOutput = await aws().tm.getEntity({
          workspaceId: workspaceId,
          entityId: entitySummary.entityId,
        });

        const componentsDetails = entityDetails['components'];
        let filteredComponentDetails;
        if (componentsDetails != undefined) {
          filteredComponentDetails = Object.entries(componentsDetails).reduce(
            (acc, [componentName, componentDetail]) => {
              const propertiesDetails = componentDetail['properties'] as object;
              // FIXME test case where property is added in component for entity but not in component type
              const filteredProperties = Object.entries(propertiesDetails).reduce(
                (prop_acc, [propName, propDetail]) => {
                  if (propDetail['value'] != undefined) {
                    prop_acc[propName] = {
                      definition: {
                        dataType: propDetail['definition']['dataType'],
                      },
                      value: propDetail['value'],
                    };
                  }

                  return prop_acc;
                },
                {} as { [key: string]: object }
              );

              // process
              const filteredComponentDetail = {
                componentTypeId: componentDetail['componentTypeId'],
                properties: filteredProperties,
              };
              acc[componentName] = filteredComponentDetail;
              return acc;
            },
            {} as { [key: string]: object }
          );
        } else {
          filteredComponentDetails = [];
        }

        const entityDefinition = {
          components: filteredComponentDetails,
          description: entityDetails['description'],
          entityId: entityDetails['entityId'],
          entityName: entityDetails['entityName'],
          parentEntityId: entityDetails['parentEntityId'],
        };
        entities.push(entityDefinition); // FIXME inherited values?
      }
    }
  }
  fs.writeFileSync(path.join(outDir, 'entities.json'), JSON.stringify(entities, null, 4)); // TODO handle entity file name collisions
  tmdk_config['entities'] = 'entities.json';

  fs.writeFileSync(path.join(outDir, 'tmdk.json'), JSON.stringify(tmdk_config, null, 4));
  return tmdk_config;
}

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id'];
  const region: string = argv.region;
  const outDir: string = argv.out;
  console.log(`Bootstrapping project from workspace ${workspaceId} in ${region} at project directory ${outDir}`);

  initDefaultAwsClients({ region: region });

  await verifyWorkspaceExists(workspaceId);

  // create directory if not exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
    console.log(`Created directory: ${outDir}`);
  }

  // create tmdk.json file
  let tmdk_config: tmdk_config_file = {
    version: '0.0.2',
    component_types: [],
    scenes: [],
    models: [],
    entities: '',
  };

  fs.writeFileSync(path.join(outDir, 'tmdk.json'), JSON.stringify(tmdk_config, null, 4));

  // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)

  // import component types
  console.log('====== Component Types ======');
  tmdk_config = await import_component_types(workspaceId, tmdk_config, outDir);

  // import scenes
  console.log('====== Scenes / Models ======');
  tmdk_config = await import_scenes_and_models(workspaceId, tmdk_config, outDir);

  // import entities
  console.log('========== Entities =========');
  tmdk_config = await import_entities(workspaceId, tmdk_config, outDir);

  console.log('== Finishing bootstrap ... ==');

  return 0;
};
