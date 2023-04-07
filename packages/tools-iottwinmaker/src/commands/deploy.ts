import type { Arguments, CommandBuilder } from 'yargs';
import {
  ConflictException,
  FunctionResponse,
  GetWorkspaceCommandOutput,
  PropertyDefinitionResponse,
  ResourceNotFoundException,
  ValidationException,
} from '@aws-sdk/client-iottwinmaker';
import { getDefaultAwsClients as aws, initDefaultAwsClients } from '../lib/aws-clients';
import * as fs from 'fs';
import { createComponentTypeIfNotExists, waitForComponentTypeActive } from '../lib/component-type';
import { importScene } from '../lib/scene';
import { importResource } from '../lib/resource';
import { syncEntitiesFunction } from '../lib/sync';
import { tmdt_config_file } from './init';
import * as path from 'path';
import { verifyWorkspaceExists } from '../lib/utils';
import { prompt } from 'prompts';
import { syncSiteWisePropertyValues } from '../lib/property-values';
import { createWorkspaceIfNotExists } from '../lib/workspace';

export type Options = {
  region: string;
  'workspace-id': string;
  dir: string;
  'upload-sitewise': boolean;
};

export const command = 'deploy';
export const desc = 'Deploys a tmdt application';

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
      description: 'Specify the project location, directory for tmdt.json file.',
    },
    'upload-sitewise': {
      type: 'boolean',
      require: false,
      default: false,
      description: 'Optionally upload all sitewise property value data stored in the tmdt project.',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id']; // TODO allow it to be optional (i.e. option to autogenerate workspace for them)
  const region: string = argv.region;
  const dir: string = argv.dir;
  let uploadSitewise: boolean = argv['upload-sitewise'];
  console.log(`Deploying project from directory ${dir} into workspace ${workspaceId} in ${region}`);

  initDefaultAwsClients({ region: region });
  if (!fs.existsSync(path.join(dir, 'tmdt.json'))) {
    throw new Error('TDMK.json does not exist. Please run tmdt init first.');
  }
  // read tmdt json file
  const tmdt_config_buffer = fs.readFileSync(path.join(dir, 'tmdt.json'), 'utf-8'); // TODO encodings
  const tmdt_config: tmdt_config_file = JSON.parse(tmdt_config_buffer);
  console.log('========= tmdt.json =========');
  console.log(tmdt_config);

  try {
    await verifyWorkspaceExists(workspaceId);
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      const response = await prompt({
        type: 'text',
        name: 'confirmation',
        message: `Workspace [${workspaceId}] in region [${region}] not found. Would you like to automatically create a workspace with name [${workspaceId}], S3 bucket, and
        workspace role to continue deployment (Y)? Press any other key to abort (n).`,
      });
      if (response.confirmation === 'Y') {
        await createWorkspaceIfNotExists(workspaceId);
      } else {
        console.log('Aborting deployment...');
        return 0;
      }
    } else {
      throw e;
    }
  }

  // TODO global variable for file/folder names
  if (uploadSitewise && fs.existsSync(path.join(dir, 'property_values'))) {
    // ask user to confirm data transfer
    // TODO print amount of data to be uploaded?
    await (async () => {
      const response = await prompt({
        type: 'text',
        name: 'confirmation',
        message: `Are you sure you wish to upload all SiteWise property value data in tmdt project [${dir}] ? (Y/n)`,
      });

      uploadSitewise = response.confirmation === 'Y';
    })();
  }

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
    for (const componentTypeFile of tmdt_config['component_types']) {
      const componentTypeDefinitionStr = fs.readFileSync(path.join(dir, componentTypeFile), 'utf-8');
      const componentTypeDefinition = JSON.parse(componentTypeDefinitionStr);
      // remove inherited properties
      const propertyDefinitions: Record<string, PropertyDefinitionResponse> =
        componentTypeDefinition['propertyDefinitions'];
      if (propertyDefinitions != undefined) {
        componentTypeDefinition['propertyDefinitions'] = Object.entries(propertyDefinitions).reduce(
          (acc, [key, value]) => {
            if (!value['isInherited']) {
              acc[key] = value;
            } else if ('defaultValue' in value) {
            acc[key] = { defaultValue: value['defaultValue'] };
          }
            return acc;
          },
          {} as { [key: string]: object }
        );
      }
      // remove inherited functions
      const componentTypeFunctions: Record<string, FunctionResponse> = componentTypeDefinition['functions'];
      if (componentTypeFunctions != undefined) {
        const filtered_functions = Object.entries(componentTypeFunctions).reduce((acc, [key, value]) => {
          if (!value['isInherited']) {
            acc[key] = value;
          }
          return acc;
        }, {} as { [key: string]: object });
        componentTypeDefinition['functions'] = filtered_functions;
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
  for (const sceneFile of tmdt_config['scenes']) {
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
  for (const modelFile of tmdt_config['models']) {
    console.log(`Importing model: ${modelFile} ...`);
    await importResource(workspaceId, path.join(dir, '3d_models', modelFile), modelFile);
  }

  // import entities
  console.log('========== Entities =========');
  const entityFileName = tmdt_config['entities'];
  const entityFileJson = JSON.parse(fs.readFileSync(path.join(dir, entityFileName), 'utf-8'));
  await syncEntitiesFunction(workspaceId, entityFileJson);

  // optionally upload sitewise property values
  if (uploadSitewise) {
    console.log('====== SiteWise Property Values =====');
    await syncSiteWisePropertyValues(workspaceId, path.join(dir, 'property_values'), entityFileJson);
  }

  console.log('=== Deployment Completed! ===');
  return 0;
};
