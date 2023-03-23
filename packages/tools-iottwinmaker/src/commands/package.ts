import type { Arguments, CommandBuilder } from 'yargs';

export type Options = {
  region: string;
  'workspace-id': string;
  'grafana-workspace-id': string;
};

export const command = 'package';
export const desc = 'Packages a tmdt application into a deployable artifact (e.g. CFN)';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    dir: {
      type: 'string',
      require: true,
      description: 'Specify the project location, directory for tmdt.json file',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  console.log(`Audit received arguments: ${argv}`);
  console.log('Not yet implemented');
  return 0;
};
