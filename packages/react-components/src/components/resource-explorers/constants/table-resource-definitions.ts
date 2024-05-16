import { DEFAULT_STRING_FILTER_OPERATORS } from './defaults';
import type {
  AssetModelResource,
  AssetPropertyResource,
  AssetResource,
  TimeSeriesResource,
} from '../types/resources';
import type { TableResourceDefinition } from '../types/table';
import type { RenderTableResourceField } from '../types/common';

export const DEFAULT_ASSET_MODEL_TABLE_DEFINITION: TableResourceDefinition<AssetModelResource> =
  [
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: ({ name }) => name,
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
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ assetModelId }) => assetModelId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
  ];

export function createDefaultAssetTableDefinition(
  renderName: RenderTableResourceField<AssetResource>
): TableResourceDefinition<AssetResource> {
  return [
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: renderName,
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
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ assetId }) => assetId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'assetModelId',
      name: 'Asset model ID',
      pluralName: 'Asset model IDs',
      render: ({ assetModelId }) => assetModelId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
  ];
}

export const DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION: TableResourceDefinition<AssetPropertyResource> =
  [
    {
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ propertyId }) => propertyId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: ({ name }) => name,
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
      id: 'unit',
      name: 'Unit',
      pluralName: 'Units',
      render: ({ unit }) => unit,
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
  ];

export const DEFAULT_TIME_SERIES_TABLE_DEFINITION: TableResourceDefinition<TimeSeriesResource> =
  [
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
  ];
