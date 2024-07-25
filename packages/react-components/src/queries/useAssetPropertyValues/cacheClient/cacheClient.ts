import isEqual from 'lodash.isequal';
import omitBy from 'lodash.omitby';
import { isUndefined } from 'lodash';
import { Interval, TimeSeriesDataCacheClient } from '../../useTimeSeriesData';
import {
  assetPropertyValuePointMilliseconds,
  filterAssetPropertyValues,
} from '../cacheUtils/filterAssetPropertyValues';
import {
  AssetPropertyValuesData,
  AssetPropertyValuesRequest,
} from '../types';

export class AssetPropertyValuesCacheClient extends TimeSeriesDataCacheClient<
  AssetPropertyValuesRequest,
  AssetPropertyValuesData[number]
> {
  #sortTimeSeriesData(
    data: AssetPropertyValuesData
  ): AssetPropertyValuesData {
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
