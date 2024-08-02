import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

export type UnmodeledDataStream = {
  alias: TimeSeriesSummary['alias'];
  dataType: TimeSeriesSummary['dataType'];
  dataTypeSpec: TimeSeriesSummary['dataTypeSpec'];
};
