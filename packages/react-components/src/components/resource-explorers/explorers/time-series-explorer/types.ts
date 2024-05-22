import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type {
  BatchGetAssetPropertyValue,
  ListTimeSeries,
} from '../../types/request-fn';
import type { TimeSeriesResource } from '../../types/resources';
import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';

export interface TimeSeriesExplorerProps
  extends CommonResourceExplorerProps<TimeSeriesResource> {
  parameters?: readonly TimeSeriesRequestParameters[];
  requestFns?: {
    batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
    listTimeSeries?: ListTimeSeries;
  };
  onSelectTimeSeries?: OnSelectResource<TimeSeriesResource>;
  selectedTimeSeries?: SelectedResources<TimeSeriesResource>;
  isTimeSeriesDisabled?: IsResourceDisabled<TimeSeriesResource>;
}

export interface TimeSeriesRequestParameters {
  aliasPrefix?: string;
  assetId?: string;
  timeSeriesType?: 'ASSOCIATED' | 'DISASSOCIATED';
}
