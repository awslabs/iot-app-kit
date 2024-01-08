import type { Arguments, CommandBuilder } from 'yargs';
import { prompt } from 'prompts';
import {
  getDefaultAwsClients as aws,
  initDefaultAwsClients,
} from '../lib/aws-clients';
import { deleteComponentTypes } from '../lib/component-type';
import { deleteScenes } from '../lib/scene';
import { deleteEntitiesWithServiceRecursion } from '../lib/entity';
import { verifyWorkspaceExists } from '../lib/utils';
import {
  deleteWorkspaceBucketAndLogs,
  deleteWorkspace,
} from '../lib/workspace';

export type Options = {
  'workspace-id': string;
  region: string;
  'delete-workspace': boolean;
  'delete-s3-bucket': boolean;
  'non-dry-run': boolean;
};

export const command = 'destroy';
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
      description: 'Specify the ID of the Workspace to delete from.',
    },
    'delete-workspace': {
      type: 'boolean',
      require: false,
      description: 'Specify if TM workspace should also be deleted.',
      default: false,
    },
    'delete-s3-bucket': {
      type: 'boolean',
      require: false,
      description:
        'Specify if workspace s3 Bucket, its contents, and any associated logging bucket should be deleted.',
      implies: 'delete-workspace',
      default: false,
    },
    'non-dry-run': {
      type: 'boolean',
      require: 'false',
      description: 'Specify non-dry-run for real run execution of destroy.',
      default: false,
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId: string = argv['workspace-id'];
  const region: string = argv.region;
  let deleteWorkspaceFlag: boolean = argv['delete-workspace'];
  let deleteS3Flag: boolean = argv['delete-s3-bucket'];
  const nonDryRun: boolean = argv['non-dry-run'];

  initDefaultAwsClients({ region: region });

  await verifyWorkspaceExists(workspaceId);

  if (!nonDryRun) {
    console.log(
      '\nDry Run: None of the following resources will be deleted. Use --nonDryRun flag for real deletion.\n'
    );
  }

  // TODO also determine the current account
  await (async () => {
    const destroyResponse = await prompt({
      type: 'text',
      name: 'confirmation',
      message: `Are you sure you wish to delete all entities, component types, and scenes from IoT TwinMaker workspace [${workspaceId}] in region [${region}] ? (Y/n)`,
    });
    if (deleteS3Flag) {
      const promptResp = await prompt({
        type: 'text',
        name: 'confirmation',
        message: `Are you sure you wish to delete the workspace [${workspaceId}], its associated workspace S3 bucket, and any potential logging bucket ? (Y/n)`,
      });
      if (promptResp.confirmation !== 'Y') {
        deleteS3Flag = false;
        deleteWorkspaceFlag = false;
      }
    }
    if (deleteWorkspaceFlag && !deleteS3Flag) {
      const promptResp = await prompt({
        type: 'text',
        name: 'confirmation',
        message: `Are you sure you wish to delete the specified TwinMaker workspace [${workspaceId}] in region [${region}] ? (Y/n)`,
      });
      if (promptResp.confirmation !== 'Y') {
        deleteWorkspaceFlag = false;
      }
    }

    if (destroyResponse.confirmation === 'Y') {
      // delete all entities with basic confirmation
      console.log('========== Entities =========');
      await deleteEntitiesWithServiceRecursion(workspaceId, nonDryRun);

      // delete all component types with basic confirmation
      console.log('====== Component Types ======');
      await deleteComponentTypes(workspaceId, nonDryRun);

      // delete all scenes with confirmation
      console.log('====== Scenes / Models ======');
      await deleteScenes(workspaceId, nonDryRun);

      if (deleteWorkspaceFlag) {
        // delete the workspace
        console.log('========= Workspace =========');
        // first retrieve s3 and role information before workspace deletion
        const { s3Location, role } = await aws().tm.getWorkspace({
          workspaceId,
        });
        // s3Location format: arn:aws:s3:::{s3BucketName}
        const s3BucketName = s3Location?.split(':').pop();
        // role format: arn:aws:iam::accountID:role/{roleName}
        const roleName = role?.split(/:|\//).pop();
        await deleteWorkspace(workspaceId, nonDryRun);

        if (deleteS3Flag) {
          // delete the S3 Bucket and logs
          console.log('=== S3 Bucket and Logging ===');
          await deleteWorkspaceBucketAndLogs(s3BucketName, nonDryRun);
        }
        console.log(
          `\nIf you wish to delete IAM role: [${roleName}], visit the AWS IAM console here:\nhttps://console.aws.amazon.com/iam/`
        );
      }

      if (!nonDryRun) {
        console.log(
          '\n[Completed] Dry run finished. Please use --nonDryRun flag to delete resources shown.'
        );
      } else {
        console.log(
          `\n[Completed] All specified resources have been deleted from ${workspaceId}.`
        );
      }
    } else {
      console.log("'Y' not entered, cancelling execution.");
    }
  })();

  return 0;
};
