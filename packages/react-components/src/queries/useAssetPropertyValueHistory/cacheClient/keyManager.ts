import {
  SeriaizedRequest,
  TimeSeriesDataCacheKeyManager,
} from '../../useTimeSeriesData';
import { AssetPropertyValueHistoryRequest } from '../types';

export class AssetPropertyValueHistoryKeyManager extends TimeSeriesDataCacheKeyManager<AssetPropertyValueHistoryRequest> {
  RESOURCE = 'Asset property value history';

  serializeRequest(
    request: AssetPropertyValueHistoryRequest
  ): SeriaizedRequest {
    const {
      assetId,
      propertyAlias,
      propertyId,
      startDate,
      endDate,
      qualities,
      timeOrdering,
    } = request;
    return {
      assetId,
      propertyAlias,
      propertyId,
      startDate,
      endDate,
      qualities,
      timeOrdering,
    };
  }
  deserializeRequest(
    serializedRequest: SeriaizedRequest
  ): AssetPropertyValueHistoryRequest {
    return serializedRequest;
  }
}
