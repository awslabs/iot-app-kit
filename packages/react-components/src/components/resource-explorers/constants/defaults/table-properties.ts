import type {
  AssetModelSummary,
  AssetSummary,
  AssetProperty,
  TimeSeriesSummary,
} from '@aws-sdk/client-iotsitewise';
import { ResourceTableProps } from '../../tables/resource-table';
import { DEFAULT_STRING_FILTER_OPERATORS } from './misc';

export const DEFAULT_ASSET_MODEL_TABLE_PROPERTIES: ResourceTableProps<AssetModelSummary>['properties'] =
  [
    {
      id: 'arn',
      name: 'ARN',
      pluralName: 'ARNs',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ arn }) => arn,
    },
    {
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ id }) => id,
    },
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ name }) => name,
    },
    {
      id: 'description',
      name: 'Description',
      pluralName: 'Descriptions',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ description }) => description,
    },
    {
      id: 'assetModelType',
      name: 'Type',
      pluralName: 'Types',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ assetModelType }) => assetModelType,
    },
    {
      id: 'externalId',
      name: 'External ID',
      pluralName: 'External IDs',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ externalId }) => externalId,
    },
    {
      id: 'status',
      name: 'State',
      pluralName: 'States',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ status: { state = '' } = {} }) => state,
    },
    {
      id: 'creationDate',
      name: 'Creation date',
      pluralName: 'Creation dates',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ creationDate }) => creationDate?.toLocaleDateString(),
    },
    {
      id: 'lastUpdateDate',
      name: 'Last update date',
      pluralName: 'Last update dates',
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      render: ({ lastUpdateDate }) => lastUpdateDate?.toLocaleDateString(),
    },
  ];

export function createDefaultAssetTableProperties(
  renderName: ResourceTableProps<AssetSummary>['properties'][number]['render']
): ResourceTableProps<AssetSummary>['properties'] {
  return [
    {
      id: 'arn',
      name: 'ARN',
      pluralName: 'ARNs',
      render: ({ arn }) => arn,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ id }) => id,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'description',
      name: 'Description',
      pluralName: 'Descriptions',
      render: ({ description }) => description,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: renderName,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
  ];
}

export const DEFAULT_ASSET_PROPERTY_TABLE_PROPERTIES: ResourceTableProps<AssetProperty>['properties'] =
  [
    {
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ id }) => id,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: ({ name }) => name,
    },
    {
      id: 'unit',
      name: 'Unit',
      pluralName: 'Units',
      render: ({ unit }) => unit,
    },
    {
      id: 'dataType',
      name: 'Data type',
      pluralName: 'Data types',
      render: ({ dataType }) => dataType,
    },
  ];

export const DEFAULT_TIME_SERIES_TABLE_PROPERTIES: ResourceTableProps<TimeSeriesSummary>['properties'] =
  [
    {
      id: 'timeSeriesArn',
      name: 'ARN',
      pluralName: 'ARNs',
      render: ({ timeSeriesArn }) => timeSeriesArn,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'timeSeriesId',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ timeSeriesId }) => timeSeriesId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'alias',
      name: 'Alias',
      pluralName: 'Aliases',
      render: ({ alias }) => alias,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'assetId',
      name: 'Asset ID',
      pluralName: 'Asset IDs',
      render: ({ assetId }) => assetId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'propertyId',
      name: 'Property ID',
      pluralName: 'Property IDs',
      render: ({ propertyId }) => propertyId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'dataType',
      name: 'Data type',
      pluralName: 'Data types',
      render: ({ dataType }) => dataType,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'dataTypeSpec',
      name: 'Data type spec',
      pluralName: 'Data type specs',
      render: ({ dataTypeSpec }) => dataTypeSpec,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'timeSeriesCreationDate',
      name: 'Creation date',
      pluralName: 'Creation dates',
      render: ({ timeSeriesCreationDate }) =>
        timeSeriesCreationDate?.toLocaleDateString(),
    },
    {
      id: 'timeSeriesLastUpdateDate',
      name: 'Last update date',
      pluralName: 'Last update dates',
      render: ({ timeSeriesLastUpdateDate }) =>
        timeSeriesLastUpdateDate?.toLocaleDateString(),
    },
  ];
