import omitBy from 'lodash.omitby';
import {
  SeriaizedRequest,
  TimeSeriesDataCacheKeyManager,
} from '../../useTimeSeriesData';
import { AssetPropertyValueHistoryRequest } from '../types';
import { isUndefined } from 'lodash';

export class AssetPropertyValueHistoryKeyManager extends TimeSeriesDataCacheKeyManager<AssetPropertyValueHistoryRequest> {
  RESOURCE = 'Asset property value history';

  serializeQueryExecutionRequest(
    request: AssetPropertyValueHistoryRequest
  ): SeriaizedRequest {
    const {
      assetId,
      propertyAlias,
      propertyId,
      qualities,
      timeOrdering,
      maxResults,
      numberOfDataPointsToScanFor,
    } = request;
    return omitBy(
      {
        assetId,
        propertyAlias,
        propertyId,
        qualities,
        timeOrdering,
        maxResults,
        numberOfDataPointsToScanFor,
      },
      isUndefined
    );
  }

  serializeRequest(
    request: AssetPropertyValueHistoryRequest
  ): SeriaizedRequest {
    const { assetId, propertyAlias, propertyId } = request;
    return omitBy(
      {
        assetId,
        propertyAlias,
        propertyId,
      },
      isUndefined
    );
  }
  deserializeRequest(
    serializedRequest: SeriaizedRequest
  ): AssetPropertyValueHistoryRequest {
    return serializedRequest;
  }
}
