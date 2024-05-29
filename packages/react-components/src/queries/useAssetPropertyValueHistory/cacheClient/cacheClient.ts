import isEqual from 'lodash.isequal';
import { Interval, TimeSeriesDataCacheClient } from '../../useTimeSeriesData';
import {
  assetPropertyValuePointMilliseconds,
  filterAssetPropertyValues,
} from '../cacheUtils/filterAssetPropertyValues';
import {
  AssetPropertyValueHistoryData,
  AssetPropertyValueHistoryRequest,
} from '../types';
import omitBy from 'lodash.omitby';
import { isUndefined } from 'lodash';

export class AssetPropertyValueHistoryCacheClient extends TimeSeriesDataCacheClient<
  AssetPropertyValueHistoryRequest,
  AssetPropertyValueHistoryData[number]
> {
  #sortTimeSeriesData(
    data: AssetPropertyValueHistoryData
  ): AssetPropertyValueHistoryData {
    return data.sort(
      (a, b) =>
        assetPropertyValuePointMilliseconds(a) -
        assetPropertyValuePointMilliseconds(b)
    );
  }

  matchesRequest(
    requestA: AssetPropertyValueHistoryRequest,
    requestB: AssetPropertyValueHistoryRequest
  ): boolean {
    return isEqual(
      omitBy(requestA, isUndefined),
      omitBy(requestB, isUndefined)
    );
  }
  filterTimeSeriesData(
    data: AssetPropertyValueHistoryData,
    interval: Interval
  ): AssetPropertyValueHistoryData {
    return filterAssetPropertyValues(data, interval);
  }
  addTimeSeriesData(
    oldData?: AssetPropertyValueHistoryData,
    newData?: AssetPropertyValueHistoryData
  ): AssetPropertyValueHistoryData {
    return this.#sortTimeSeriesData([...(oldData ?? []), ...(newData ?? [])]);
  }
}
