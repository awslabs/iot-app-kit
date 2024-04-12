import {
  AssetModelName,
  AssetName,
  AssetPropertyName,
  TimeSeriesName,
} from '../../types/resource';
import type {
  FilterOperator,
  ResourceTableUserSettings,
} from '../../types/resource-table';
import { ResourceTableProps } from '../../tables/resource-table';

export const DEFAULT_DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_STRING_FILTER_OPERATORS = [
  '=',
  '!=',
  ':',
  '!:',
] satisfies FilterOperator[];

export const ASSET_MODEL_NAME: AssetModelName = 'asset model';
export const ASSET_NAME: AssetName = 'asset';
export const ASSET_PROPERTY_NAME: AssetPropertyName = 'asset property';
export const TIME_SERIES_NAME: TimeSeriesName = 'time series';

export function createDefaultTableUserSettings<Resource>(
  properties: ResourceTableProps<Resource>['properties']
): ResourceTableUserSettings<Resource> {
  const columnDisplay = properties.map(({ id }) => ({ id, isVisible: true }));

  return {
    columnDisplay,
    wrapLines: false,
    stickyColumns: {},
    stripedRows: false,
    contentDensity: 'comfortable',
  };
}
