import type { Arguments, CommandBuilder } from 'yargs';

import { initDefaultAwsClients } from '../lib/aws-clients';
import { verifyWorkspaceExists } from '../lib/utils';

export type Options = {
  region: string;
  'workspace-id': string;
  'grafana-workspace-id': string | undefined;
};

export const command = 'audit';
export const desc =
  'Scans IoT TwinMaker resources for issues (missing permissions, outdated plugin version, unused resources, etc). Explanation analysis for entity/component properties (e.g. inheritance path, isAbstract causes).';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    region: {
      type: 'string',
      require: true,
      description: 'Specify the AWS region of the workspace.',
    },
    'workspace-id': {
      type: 'string',
      require: true,
      description: 'Specify the ID of the Workspace to audit.',
    },
    'grafana-workspace-id': {
      type: 'string',
      require: false,
      description: 'Specify the ID of the Grafana Workspace to audit.',
    },
    'grafana-endpoint': {
      type: 'string',
      require: false,
      description: 'Specify the Grafana endpoint to audit dashboards in.',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId = argv['workspace-id'];
  const region = argv.region;
  console.log(region);
  console.log(workspaceId);

  initDefaultAwsClients({ region: region });

  await verifyWorkspaceExists(workspaceId);

  console.log('Not yet implemented');

  return 0;
};
