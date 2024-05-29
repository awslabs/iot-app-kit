import { Viewport } from '../useTimeSeriesData';
import { useTimeSeriesDataRequestManager } from '../useTimeSeriesData/requestManager';
import { ASSET_PROPERTY_VALUE_HISTORY_CACHE_CLIENT } from './cacheClient';
import { AssetPropertyValueHistoryRequest } from './types';

type AssetPropertyValueHistoryRequestManagerOptions = {
  requests: AssetPropertyValueHistoryRequest[];
  viewport: Viewport;
};

export const useAssetPropertyValueHistoryRequestManager = (
  options: AssetPropertyValueHistoryRequestManagerOptions
) => {
  return useTimeSeriesDataRequestManager({
    ...options,
    cacheClient: ASSET_PROPERTY_VALUE_HISTORY_CACHE_CLIENT,
  });
};
