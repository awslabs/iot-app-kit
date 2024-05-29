import {
  AssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryRequestFunction,
} from '../useAssetPropertyValueHistory';
import { useAssetPropertyValueHistory } from '../useAssetPropertyValueHistory/useAssetPropertyValueHistory';
import { RequestSettings } from './requestManager';
import { Viewport } from './types';

type Request = AssetPropertyValueHistoryRequest;
type RequestFunctions = {
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
};

export type UseTimeSeriesDataOptions = {
  requests: Request[];
  viewport: Viewport;
  requestFns?: RequestFunctions;
  settings?: RequestSettings;
};

const filterRequests = (requests: Request[]) => {
  return {
    assetPropertyValueHistoryRequests: requests,
  };
};

export const useTimeSeriesData = ({
  requests,
  viewport,
  requestFns = {},
  settings = {},
}: UseTimeSeriesDataOptions) => {
  const { assetPropertyValueHistoryRequests } = filterRequests(requests);

  /**
   * Raw historical data
   */
  const assetPropertyValueHistory = useAssetPropertyValueHistory({
    requests: assetPropertyValueHistoryRequests,
    viewport,
    requestFns,
    settings,
  });

  return assetPropertyValueHistory;
};
