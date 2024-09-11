import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type {
  BatchGetAssetPropertyValue,
  ListTimeSeries,
} from '@iot-app-kit/core';
import type { TimeSeriesResource } from '../../types/resources';
import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';

export interface TimeSeriesExplorerProps
  extends CommonResourceExplorerProps<TimeSeriesResource> {
  parameters?: readonly TimeSeriesRequestParameters[];
  iotSiteWiseClient?: {
    batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
    listTimeSeries?: ListTimeSeries;
  };
  onSelectTimeSeries?: OnSelectResource<TimeSeriesResource>;
  selectedTimeSeries?: SelectedResources<TimeSeriesResource>;
  isTimeSeriesDisabled?: IsResourceDisabled<TimeSeriesResource>;
  description?: string;
  timeZone?: string;
  significantDigits?: number;
}

export interface TimeSeriesRequestParameters {
  aliasPrefix?: string;
  assetId?: string;
  timeSeriesType?: 'ASSOCIATED' | 'DISASSOCIATED';
}
