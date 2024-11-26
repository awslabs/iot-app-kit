import isEqual from 'lodash-es/isEqual';
import isUndefined from 'lodash-es/isUndefined';
import omitBy from 'lodash-es/omitBy';
import {
  type Interval,
  TimeSeriesDataCacheClient,
} from '../../useTimeSeriesData';
import {
  assetPropertyValuePointMilliseconds,
  filterAssetPropertyValues,
} from '../cacheUtils/filterAssetPropertyValues';
import {
  type AssetPropertyValuesData,
  type AssetPropertyValuesRequest,
} from '../types';

export class AssetPropertyValuesCacheClient extends TimeSeriesDataCacheClient<
  AssetPropertyValuesRequest,
  AssetPropertyValuesData[number]
> {
  #sortTimeSeriesData(data: AssetPropertyValuesData): AssetPropertyValuesData {
    return data.sort(
      (a, b) =>
        assetPropertyValuePointMilliseconds(a) -
        assetPropertyValuePointMilliseconds(b)
    );
  }

  matchesRequest(
    requestA: AssetPropertyValuesRequest,
    requestB: AssetPropertyValuesRequest
  ): boolean {
    return isEqual(
      omitBy(requestA, isUndefined),
      omitBy(requestB, isUndefined)
    );
  }
  filterTimeSeriesData(
    data: AssetPropertyValuesData,
    interval: Interval
  ): AssetPropertyValuesData {
    return filterAssetPropertyValues(data, interval);
  }
  addTimeSeriesData(
    oldData?: AssetPropertyValuesData,
    newData?: AssetPropertyValuesData
  ): AssetPropertyValuesData {
    return this.#sortTimeSeriesData([...(oldData ?? []), ...(newData ?? [])]);
  }
}
