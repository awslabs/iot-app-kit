import type { Arguments, CommandBuilder } from 'yargs';
import { prompt } from 'prompts';
import { initDefaultAwsClients } from '../lib/aws-clients';
import { deleteComponentTypes } from '../lib/component-type';
import { deleteScenes } from '../lib/scene';
import { deleteEntitiesWithServiceRecursion } from '../lib/entity';
import { verifyWorkspaceExists } from '../lib/utils';

export type Options = {
  'workspace-id': string;
  region: string;
};

export const command = 'nuke';
export const desc = 'Deletes an IoT TwinMaker workspace and all its resources';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    region: {
      type: 'string',
      require: true,
      description: 'Specify the AWS region of the workspace to delete.',
    },
    'workspace-id': {
      type: 'string',
      require: true,
      description: 'Specify the ID of the Workspace to delete.',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id'];
  const region: string = argv.region;

  initDefaultAwsClients({ region: region });

  await verifyWorkspaceExists(workspaceId);

  // TODO also determine the current account
  await (async () => {
    const response = await prompt({
      type: 'text',
      name: 'confirmation',
      message: `Are you sure you wish to delete all entities, component types, and scenes from IoT TwinMaker workspace [${workspaceId}] in region [${region}] ? (Y/n)`,
    });

    if (response.confirmation === 'Y') {
      // delete all entities with basic confirmation
      console.log('========== Entities =========');
      await deleteEntitiesWithServiceRecursion(workspaceId);

      // delete all component types with basic confirmation
      console.log('====== Component Types ======');
      await deleteComponentTypes(workspaceId);

      // delete all scenes with confirmation
      console.log('====== Scenes / Models ======');
      await deleteScenes(workspaceId);

      // TODO support delete the workspace + s3 bucket contents + s3 bucket

      console.log(
        `[Completed] All entities, component-types, and scenes have been deleted from ${workspaceId}. Workspace can now be deleted in console or CLI.`
      );
    } else {
      console.log("'Y' not entered, cancelling execution.");
    }
  })();

  return 0;
};
