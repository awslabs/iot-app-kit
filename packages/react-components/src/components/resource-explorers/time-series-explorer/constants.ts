import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import type { ResourceSchema } from '../resource-table/types';

export const TIME_SERIES_EXPLORER_SCHEMA: ResourceSchema<TimeSeriesSummary> = {
  name: 'Time series',
  pluralName: 'Time series',
  properties: [
    {
      id: 'alias',
      name: 'Alias',
      pluralName: 'Aliases',
      render: ({ alias }) => alias,
      filterOperators: ['!:'],
    },
    {
      id: 'assetId',
      name: 'Asset ID',
      pluralName: 'Asset IDs',
      render: ({ assetId }) => assetId,
    },
    {
      id: 'dataType',
      name: 'Data type',
      pluralName: 'Data types',
      render: ({ dataType }) => dataType,
    },
    {
      id: 'dataTypeSpec',
      name: 'Data type spec',
      pluralName: 'Data type specs',
      render: ({ dataTypeSpec }) => dataTypeSpec,
    },
    {
      id: 'propertyId',
      name: 'Property ID',
      pluralName: 'Property IDs',
      render: ({ propertyId }) => propertyId,
    },
    {
      id: 'timeSeriesArn',
      name: 'ARN',
      pluralName: 'ARNs',
      render: ({ timeSeriesArn }) => timeSeriesArn,
    },
    {
      id: 'timeSeriesCreationDate',
      name: 'Creation date',
      pluralName: 'Creation dates',
      render: ({ timeSeriesCreationDate }) =>
        timeSeriesCreationDate?.toLocaleDateString(),
    },
    {
      id: 'timeSeriesId',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ timeSeriesId }) => timeSeriesId,
    },
    {
      id: 'timeSeriesLastUpdateDate',
      name: 'Last update date',
      pluralName: 'Last update dates',
      render: ({ timeSeriesLastUpdateDate }) =>
        timeSeriesLastUpdateDate?.toLocaleDateString(),
    },
  ],
};
