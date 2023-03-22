import type { Arguments, CommandBuilder } from 'yargs';

import { ConflictException, GetWorkspaceCommandOutput, ValidationException } from '@aws-sdk/client-iottwinmaker';
import { getDefaultAwsClients as aws, initDefaultAwsClients } from '../lib/aws-clients';
import * as fs from 'fs';
import { createComponentTypeIfNotExists, waitForComponentTypeActive } from '../lib/component-type';
import { importScene } from '../lib/scene';
import { importResource } from '../lib/resource';
import { syncEntitiesFunction } from '../lib/sync';
import { tmdk_config_file } from './init';
import * as path from 'path';
import { verifyWorkspaceExists } from '../lib/utils';

export type Options = {
  region: string;
  'workspace-id': string;
  dir: string;
};

export const command = 'deploy';
export const desc = 'Deploys a tmdk application';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    region: {
      type: 'string',
      require: true,
      description: 'Specify the AWS region to deploy to.',
    },
    'workspace-id': {
      type: 'string',
      require: true,
      description: 'Specify the ID of the Workspace to deploy to.',
    },
    dir: {
      type: 'string',
      require: true,
      description: 'Specify the project location, directory for tmdk.json file',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id']; // TODO allow it to be optional (i.e. option to autogenerate workspace for them)
  const region: string = argv.region;
  const dir: string = argv.dir;
  console.log(`Deploying project from directory ${dir} into workspace ${workspaceId} in ${region}`);

  initDefaultAwsClients({ region: region });
  if (!fs.existsSync(path.join(dir, 'tmdk.json'))) {
    throw new Error('TDMK.json does not exist. Please run tmdk init first.');
  }
  // read tmdk json file
  const tmdk_config_buffer = fs.readFileSync(path.join(dir, 'tmdk.json'), 'utf-8'); // TODO encodings
  const tmdk_config: tmdk_config_file = JSON.parse(tmdk_config_buffer);
  console.log('========= tmdk.json =========');
  console.log(tmdk_config);

  await verifyWorkspaceExists(workspaceId);

  // get workspace bucket
  let workspaceContentBucket = '';
  try {
    const workspaceDesc: GetWorkspaceCommandOutput = await aws().tm.getWorkspace({ workspaceId: workspaceId });
    if (workspaceDesc['s3Location']) {
      workspaceContentBucket = workspaceDesc['s3Location'].split(':').slice(-1)[0];
    }
  } catch (e) {
    console.error('Error while getting the workspace bucket.\n', e);
    throw e;
  }

  // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)
  // import component types into workspace
  console.log('====== Component Types ======');
  let stillComponentRemaining = true; // FIXME cleaner dependency creation process
  while (stillComponentRemaining) {
    stillComponentRemaining = false;
    for (const componentTypeFile of tmdk_config['component_types']) {
      const componentTypeDefinitionStr = fs.readFileSync(path.join(dir, componentTypeFile), 'utf-8');
      const componentTypeDefinition = JSON.parse(componentTypeDefinitionStr);
      // remove inherited properties
      const propertyDefinitions = componentTypeDefinition['propertyDefinitions'] as object;
      if (propertyDefinitions != undefined) {
        const filtered_property_definitions = Object.entries(propertyDefinitions).reduce((acc, [key, value]) => {
          if (!value['isInherited']) {
            acc[key] = value;
          }
          return acc;
        }, {} as { [key: string]: object });
        componentTypeDefinition['propertyDefinitions'] = filtered_property_definitions;
      }
      // create component type if not exists
      try {
        const alreadyExists: boolean = await createComponentTypeIfNotExists(workspaceId, componentTypeDefinition);
        await waitForComponentTypeActive(workspaceId, componentTypeDefinition['componentTypeId']);
        if (!alreadyExists) {
          console.log(`Created component-type: ${componentTypeDefinition['componentTypeId']}`);
        }
      } catch (e) {
        if (
          // components are not gaurenteed to be in the correct order; retry
          e instanceof ValidationException &&
          e.message.includes('do not exist in workspace')
        ) {
          stillComponentRemaining = true;
        } else {
          console.error(`Failed to create component type, ${e}`);
          throw e;
        }
      }
    }
  }

  // import scenes
  console.log('======== Scene Files ========');
  for (const sceneFile of tmdk_config['scenes']) {
    console.log(`Importing scene: ${sceneFile} ...`);
    try {
      await importScene(workspaceId, path.join(dir, sceneFile), workspaceContentBucket);
    } catch (error) {
      if (error instanceof ConflictException) {
        console.log(`  ...skipping scene creation for ${sceneFile} due to pre-existing scene with same id`); // TODO should scan and warn instead
      } else {
        throw error;
      }
    }
  }

  // import model files
  console.log('======== Model Files ========');
  for (const modelFile of tmdk_config['models']) {
    console.log(`Importing model: ${modelFile} ...`);
    await importResource(workspaceId, path.join(dir, '3d_models', modelFile), modelFile);
  }

  // import entities
  console.log('========== Entities =========');
  const entityFileName = tmdk_config['entities'];
  const entityFileJson = JSON.parse(fs.readFileSync(path.join(dir, entityFileName), 'utf-8'));
  await syncEntitiesFunction(workspaceId, entityFileJson);

  console.log('=== Deployment Completed! ===');
  return 0;
};
