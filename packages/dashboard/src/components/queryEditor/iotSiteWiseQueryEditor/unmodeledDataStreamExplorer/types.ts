import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

export type UnmodeledDataStream = {
  propertyAlias: TimeSeriesSummary['alias'];
  dataType: TimeSeriesSummary['dataType'];
  dataTypeSpec: TimeSeriesSummary['dataTypeSpec'];
};
