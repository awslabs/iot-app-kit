import { isUndefined, omit } from 'lodash';
import omitBy from 'lodash.omitby';
import {
  type SeriaizedRequest,
  TimeSeriesDataCacheKeyManager,
} from '../../useTimeSeriesData';
import { type AssetPropertyValuesRequest } from '../types';

export class AssetPropertyValuesKeyManager extends TimeSeriesDataCacheKeyManager<AssetPropertyValuesRequest> {
  RESOURCE = 'Asset property values';

  serializeQueryExecutionRequest(
    request: AssetPropertyValuesRequest
  ): SeriaizedRequest {
    return omit(omitBy(request, isUndefined), [
      'startDate',
      'endDate',
      'nextToken',
    ]);
  }

  serializeRequest(request: AssetPropertyValuesRequest): SeriaizedRequest {
    return omit(omitBy(request, isUndefined), [
      'startDate',
      'endDate',
      'nextToken',
      'maxResults',
      'numberOfDataPointsToScanFor',
      'timeOrdering',
    ]);
  }
  deserializeRequest(
    serializedRequest: SeriaizedRequest
  ): AssetPropertyValuesRequest {
    return serializedRequest;
  }
}
