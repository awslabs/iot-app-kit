import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type {
  BatchGetAssetPropertyValue,
  ListTimeSeries,
  RequestFunctions,
} from '../../types/request-fn';
import type { TimeSeriesResource } from '../../types/resources';
import type {
  IsResourceDisabled,
  OnSelectResource,
  ResourceParameters,
  SelectedResources,
} from '../../types/common';

export interface TimeSeriesExplorerProps
  extends CommonResourceExplorerProps<TimeSeriesResource> {
  parameters?: TimeSeriesParameters;
  requestFns?: TimeSeriesExplorerRequestFunctions;
  onSelectTimeSeries?: OnSelectResource<TimeSeriesResource>;
  selectedTimeSeries?: SelectedResources<TimeSeriesResource>;
  isTimeSeriesDisabled?: IsResourceDisabled<TimeSeriesResource>;
}

export type TimeSeriesParameters = ResourceParameters<{
  aliasPrefix?: string;
  assetId?: string;
  timeSeriesType?: string;
}>;

export type TimeSeriesExplorerRequestFunctions = RequestFunctions<{
  batchGetAssetPropertyValue: BatchGetAssetPropertyValue;
  listTimeSeries: ListTimeSeries;
}>;
