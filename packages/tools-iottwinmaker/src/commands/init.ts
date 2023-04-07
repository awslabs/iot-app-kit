import type { Arguments, CommandBuilder } from 'yargs';

import { getDefaultAwsClients as aws, initDefaultAwsClients } from '../lib/aws-clients';
import * as fs from 'fs';
import * as path from 'path';
import {
  ComponentRequest,
  GetEntityCommandOutput,
  GetPropertyValueCommandOutput,
  GetPropertyValueHistoryCommandOutput,
  ListComponentTypesCommandOutput,
  ListEntitiesCommandOutput,
  ListScenesCommandOutput,
  PropertyLatestValue,
  PropertyValueHistory,
  GetComponentTypeCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { EntityDefinitionForSync, verifyWorkspaceExists } from '../lib/utils';

export type Options = {
  region: string;
  'workspace-id': string;
  out: string;
  'snapshot-sitewise': boolean;
};

export type tmdt_config_file = {
  version: string;
  component_types: string[];
  scenes: string[];
  models: string[];
  entities: string;
};

export type modifiedComponentTypeDefinition = Pick<
  GetComponentTypeCommandOutput,
  'componentTypeId' | 'description' | 'extendsFrom' | 'functions' | 'isSingleton' | 'propertyDefinitions'
>;

export const command = 'init';
export const desc = 'Initializes a tmdt application';
const entitiesFile = 'entities.json';
const utfEncoding = 'utf-8'; // TODO standardize encoding across tmdt

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
    'snapshot-sitewise': {
      type: 'boolean',
      require: false,
      default: false,
      description: 'Optionally snapshot all sitewise property value data in the workspace.',
    },
  });

async function import_component_types(workspaceIdStr: string, tmdt_config: tmdt_config_file, outDir: string) {
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

          const componentDefinition: modifiedComponentTypeDefinition = {
            componentTypeId: getComponentResp['componentTypeId'],
            description: getComponentResp['description'],
            extendsFrom: getComponentResp['extendsFrom'],
            functions: getComponentResp['functions'], // FIXME remove inherited values
            isSingleton: getComponentResp['isSingleton'],
            propertyDefinitions: getComponentResp['propertyDefinitions'],
          };

          // save to file
          fs.writeFileSync(
            path.join(outDir, `${getComponentResp['componentTypeId']}.json`),
            JSON.stringify(componentDefinition, null, 4)
          );

          tmdt_config['component_types'].push(`${getComponentResp['componentTypeId']}.json`);
        }
      }
    }
  }
  // save each non-pre-defined types into files
  fs.writeFileSync(path.join(outDir, 'tmdt.json'), JSON.stringify(tmdt_config, null, 4));
  return tmdt_config;
}

async function import_scenes_and_models(workspaceIdStr: string, tmdt_config: tmdt_config_file, outDir: string) {
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
          const sceneJson = JSON.parse(await data.Body.transformToString(utfEncoding));
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
                      if ('Key' in value && value['Size'] && value['Size'] > 0) {
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
          tmdt_config['scenes'].push(contentKey);
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
            // TODO make file system insensitive
            const subpath = `${splitKey.slice(0, index + 1).join('/')}`;
            if (!fs.existsSync(path.join(dir_path, subpath))) {
              console.log(`making path: ${dir_path}/${subpath} ...`);
              fs.mkdirSync(path.join(dir_path, subpath));
            }
          }
        }

        const data = await aws().s3.getObject({ Bucket: s3bucket, Key: s3key });
        const bodyContents = (await data.Body?.transformToString(utfEncoding)) as string;
        fs.writeFileSync(path.join(outDir, '3d_models', s3key), bodyContents);
        tmdt_config['models'].push(s3key);

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
                const binBodyContents = (await binData.Body?.transformToString(utfEncoding)) as string;
                fs.writeFileSync(path.join(outDir, '3d_models', binS3key), binBodyContents);
                tmdt_config['models'].push(binS3key);
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
                const binBodyContents = (await binData.Body?.transformToString(utfEncoding)) as string;
                fs.writeFileSync(path.join(outDir, '3d_models', binS3key), binBodyContents);
                tmdt_config['models'].push(binS3key);
              }
            }
          }
        }
      }
      // save each non-pre-defined types into files
      fs.writeFileSync(path.join(outDir, 'tmdt.json'), JSON.stringify(tmdt_config, null, 4));
    }
  }
  return tmdt_config;
}

async function import_entities(workspaceId: string, tmdt_config: tmdt_config_file, outDir: string) {
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
              acc[componentName] = {
                componentTypeId: componentDetail['componentTypeId'],
                properties: filteredProperties,
              };
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
  fs.writeFileSync(path.join(outDir, entitiesFile), JSON.stringify(entities, null, 4)); // TODO handle entity file name collisions
  tmdt_config['entities'] = entitiesFile;

  fs.writeFileSync(path.join(outDir, 'tmdt.json'), JSON.stringify(tmdt_config, null, 4));
  return tmdt_config;
}

async function import_sitewise_property_values(workspaceId: string, outDir: string) {
  // snapshot most recent seven days, TODO maybe parameterize time range and/or allow updating timestamps when deploying
  const today: Date = new Date();
  const oneWeekAgo: Date = new Date(Date.now() - 604800000); // dirty way to get a week ago
  // read entity file for list of entity definitions
  const entities: EntityDefinitionForSync[] = JSON.parse(fs.readFileSync(path.join(outDir, entitiesFile), utfEncoding));
  for (const [_, entityDefinition] of entities.entries()) {
    if (typeof entityDefinition.entityId !== 'string') {
      // TODO clean up types
      continue;
    }
    const getEntityResponse: GetEntityCommandOutput = await aws().tm.getEntity({
      workspaceId,
      entityId: entityDefinition.entityId,
    });
    const components: { [key: string]: ComponentRequest } =
      getEntityResponse.components === undefined ? {} : getEntityResponse.components;
    let timeSeriesPropertyValues: PropertyValueHistory[] = [];
    let staticPropertyValues: Record<string, PropertyLatestValue> = {};
    for (const componentName in components) {
      if (componentName !== 'IoTSiteWise') {
        // TODO expand scope of data-snapshot feature
        continue;
      }
      console.log(`Saving sitewise property value history for entity: ${getEntityResponse.entityId} ...`);
      const component: ComponentRequest = components[componentName];
      // collect properties to query
      const timeSeriesProperties = [];
      const staticProperties = [];
      for (const property in component.properties) {
        const propertyDefinition = component.properties[property];
        propertyDefinition.definition?.isTimeSeries
          ? timeSeriesProperties.push(property)
          : staticProperties.push(property);
      }
      if (
        (timeSeriesProperties.length > 0 || staticProperties.length > 0) &&
        !fs.existsSync(path.join(outDir, 'property_values'))
      ) {
        fs.mkdirSync(path.join(outDir, 'property_values'));
      }
      if (timeSeriesProperties.length > 0) {
        const getPropertyValueHistoryResponse: GetPropertyValueHistoryCommandOutput =
          await aws().tm.getPropertyValueHistory({
            workspaceId: workspaceId,
            entityId: getEntityResponse.entityId,
            componentName,
            selectedProperties: timeSeriesProperties,
            startTime: oneWeekAgo.toISOString(),
            endTime: today.toISOString(),
          });

        if (getPropertyValueHistoryResponse.propertyValues) {
          timeSeriesPropertyValues = timeSeriesPropertyValues.concat(getPropertyValueHistoryResponse.propertyValues);
        }
      }
      if (staticProperties.length > 0) {
        const getPropertyValueResponse: GetPropertyValueCommandOutput = await aws().tm.getPropertyValue({
          workspaceId: workspaceId,
          entityId: getEntityResponse.entityId,
          componentName,
          selectedProperties: staticProperties,
        });

        // TODO exclude empty property values
        if (getPropertyValueResponse.propertyValues) {
          staticPropertyValues = Object.assign({}, staticPropertyValues, getPropertyValueResponse.propertyValues);
        }
      }
    }

    // rename values -> propertyValues to enable deploy
    let renamedTimeSeries: string = JSON.stringify(timeSeriesPropertyValues, null, 4);
    renamedTimeSeries = renamedTimeSeries.replace(/"values":/g, '"propertyValues":');

    // write values to property_values folder
    // TODO better naming for files + make name constant variable
    if (timeSeriesPropertyValues.length > 0) {
      fs.writeFileSync(
        path.join(outDir, 'property_values', `${getEntityResponse.entityName}_PropertyValuesTimeSeries.json`),
        renamedTimeSeries
      );
    }
    if (Object.keys(staticPropertyValues).length > 0) {
      fs.writeFileSync(
        path.join(outDir, 'property_values', `${getEntityResponse.entityName}_PropertyValuesStatic.json`),
        JSON.stringify(staticPropertyValues, null, 4)
      );
    }
  }
}

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id'];
  const region: string = argv.region;
  const outDir: string = argv.out;
  const snapshotSitewise: boolean = argv['snapshot-sitewise'];
  console.log(`Bootstrapping project from workspace ${workspaceId} in ${region} at project directory ${outDir}`);

  initDefaultAwsClients({ region: region });

  await verifyWorkspaceExists(workspaceId);

  // create directory if not exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
    console.log(`Created directory: ${outDir}`);
  }

  // create tmdt.json file
  let tmdt_config: tmdt_config_file = {
    version: '0.0.2',
    component_types: [],
    scenes: [],
    models: [],
    entities: '',
  };

  fs.writeFileSync(path.join(outDir, 'tmdt.json'), JSON.stringify(tmdt_config, null, 4));

  // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)
  // - This could affect data snapshotting feature, role needs to be scoped to access read/write lambda

  // import component types
  console.log('====== Component Types ======');
  tmdt_config = await import_component_types(workspaceId, tmdt_config, outDir);

  // import scenes
  console.log('====== Scenes / Models ======');
  tmdt_config = await import_scenes_and_models(workspaceId, tmdt_config, outDir);

  // import entities
  console.log('========== Entities =========');
  tmdt_config = await import_entities(workspaceId, tmdt_config, outDir);

  // optionally import sitewise property values
  if (snapshotSitewise) {
    console.log('======== Property Value History =======');
    await import_sitewise_property_values(workspaceId, outDir);
  }

  console.log('== Finishing bootstrap ... ==');

  return 0;
};
