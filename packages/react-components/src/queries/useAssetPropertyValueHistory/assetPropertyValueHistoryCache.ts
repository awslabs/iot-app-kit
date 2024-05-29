import { QueryStatus, QueryClient, QueryFilters } from '@tanstack/react-query';
import {
  AssetPropertyValue,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import { bisector } from 'd3-array';
import { TimeSeriesDataCacheKeyManager } from './timeSeriesDataCacheKeyManager';
import {
  asComparable,
  asHistoricalViewport,
  compare,
  containsEnd,
  containsStart,
  covers,
} from './viewportUtils';
import {
  GetAssetPropertyValueHistoryDataRequest,
  TimeSeriesRequestViewport,
} from './types';
import { createNonNullableList } from '../../utils/createNonNullableList';
import difference from 'lodash.difference';
import { collapseRequests } from './requestIntervalUtils';

const toMilliseconds = (point: AssetPropertyValue) => {
  const secondsAsMilliseconds = (point.timestamp?.timeInSeconds ?? 0) * 1000;
  const nanosecondsAsMilliseconds = point.timestamp?.offsetInNanos
    ? point.timestamp?.offsetInNanos / 1000000
    : 0;
  return secondsAsMilliseconds + nanosecondsAsMilliseconds;
};

const pointBisector = bisector((p: AssetPropertyValue) => toMilliseconds(p));

type FilterSettings = { status?: QueryStatus; inViewport?: boolean };

export interface ITimeSeriesDataCache<Request, Data> {
  getKeyManager: () => TimeSeriesDataCacheKeyManager;
  cancelTimeSeriesRequests: (
    requestQuery: Request,
    filterSettings?: FilterSettings
  ) => void;
  getTimeSeriesRequests: (
    requestQuery: Request,
    filterSettings?: FilterSettings
  ) => Request[];
  setTimeSeriesRequestData: (requestQuery: Request, data: Data) => void;
  getTimeSeriesData: (requestQuery: Request) => Data;
}

type AssetPropertyValueHistoryData = Pick<
  GetAssetPropertyValueHistoryResponse,
  'assetPropertyValueHistory'
>;

type Request = GetAssetPropertyValueHistoryDataRequest;
type Data = GetAssetPropertyValueHistoryResponse;
export class AssetPropertyValueHistoryDataCache
  implements ITimeSeriesDataCache<Request, Data>
{
  #keyManager: TimeSeriesDataCacheKeyManager;
  #client: QueryClient;

  EMPTY_DATA = { assetPropertyValueHistory: [] };

  constructor({
    keyManager,
    client,
  }: {
    keyManager: TimeSeriesDataCacheKeyManager;
    client: QueryClient;
  }) {
    this.#keyManager = keyManager;
    this.#client = client;
  }

  private filterTimeSeriesRequests(
    requestQuery: Request,
    filterSettings?: { status?: QueryStatus; inViewport?: boolean }
  ): QueryFilters['predicate'] {
    const requestViewport = requestQuery.viewport;

    const isInViewport = (viewport: TimeSeriesRequestViewport) =>
      containsStart(requestViewport, viewport) ||
      containsEnd(requestViewport, viewport) ||
      covers(requestViewport, viewport);

    return (query) => {
      const key = query.queryKey;

      if (!this.#keyManager.isTimeSeriesDataRequestQuery(key)) {
        return false;
      }

      const keyAsRequestQuery =
        this.#keyManager.toTimeSeriesDataRequestQuery(key);

      return (
        keyAsRequestQuery.assetId === requestQuery.assetId &&
        keyAsRequestQuery.propertyId === requestQuery.propertyId &&
        (filterSettings?.status != null
          ? query.state.status === filterSettings.status
          : true) &&
        (filterSettings?.inViewport != null
          ? isInViewport(keyAsRequestQuery.viewport)
          : true)
      );
    };
  }

  private getTimeSeriesDataPointsInRange(
    points: AssetPropertyValue[],
    { startDate, endDate }: { startDate: Date; endDate: Date },
    includeBoundaryPoints = true
  ) {
    if (points.length === 0) {
      return [];
    }
    // If all data is before the view port
    if (startDate.getTime() > toMilliseconds(points[points.length - 1])) {
      return [];
    }
    // If all data is after the view port
    if (endDate.getTime() < toMilliseconds(points[0])) {
      return [];
    }

    // Otherwise return all the data within the viewport, plus an additional single data point that falls outside of
    // the viewport in either direction.
    const startIndex = Math.max(
      pointBisector.left(points, startDate) - (includeBoundaryPoints ? 1 : 0),
      0
    );
    const endIndex = Math.min(
      pointBisector.right(points, endDate) - (includeBoundaryPoints ? 0 : 1),
      points.length - 1
    );

    return points.slice(startIndex, endIndex + 1);
  }

  getKeyManager() {
    return this.#keyManager;
  }

  cancelTimeSeriesRequests(
    requestQuery: Request,
    filterSettings?: FilterSettings
  ) {
    this.#client.cancelQueries({
      predicate: this.filterTimeSeriesRequests(requestQuery, filterSettings),
    });
    this.#client.removeQueries({
      predicate: this.filterTimeSeriesRequests(requestQuery, filterSettings),
    });
  }

  getTimeSeriesRequests(
    requestQuery: Request,
    filterSettings?: FilterSettings
  ) {
    const queries = this.#client.getQueriesData({
      predicate: this.filterTimeSeriesRequests(requestQuery, filterSettings),
    });

    const timeSeriesRequests = createNonNullableList(
      queries.map(([queryKey]) => {
        return this.#keyManager.toTimeSeriesDataRequestQuery(queryKey);
      })
    );

    const sortedTimeSeriesRequests = timeSeriesRequests.sort((a, b) =>
      compare(a.viewport, b.viewport)
    );

    return sortedTimeSeriesRequests;
  }

  getTimeSeriesRequestsState(
    requestQuery: Request,
    filterSettings?: FilterSettings
  ) {
    const requests = this.getTimeSeriesRequests(requestQuery, filterSettings);
    const states = requests.map((k) =>
      this.#client.getQueryState(
        this.#keyManager.toRequestExectutionQueryKey(k)
      )
    );
    return createNonNullableList(states);
  }

  getTimeSeriesData(requestQuery: Request) {
    const dataCacheKey = this.#keyManager.toDataCacheQueryKey(requestQuery);

    const data = this.#client.getQueryData(dataCacheKey) as Data | undefined;

    const points = (data ?? this.EMPTY_DATA).assetPropertyValueHistory ?? [];

    const pointsInRequest = this.getTimeSeriesDataPointsInRange(
      points,
      asHistoricalViewport(requestQuery.viewport)
    );

    return { assetPropertyValueHistory: pointsInRequest };
  }

  addTimeSeriesData(
    oldData: AssetPropertyValueHistoryData | undefined,
    newData: AssetPropertyValueHistoryData | undefined
  ) {
    const oldAssetPropertyValueHistory =
      oldData?.assetPropertyValueHistory ?? [];
    const newAssetPropertyValueHistory =
      newData?.assetPropertyValueHistory ?? [];
    const dataToAdd = difference(
      newAssetPropertyValueHistory,
      oldAssetPropertyValueHistory
    );

    const data = [...oldAssetPropertyValueHistory, ...dataToAdd];

    const sortedData = data.sort(
      (a, b) => toMilliseconds(a) - toMilliseconds(b)
    );

    return {
      assetPropertyValueHistory: sortedData,
    };
  }

  setTimeSeriesRequestData(requestQuery: Request, data: Data) {
    const dataKey = this.#keyManager.toDataCacheQueryKey(requestQuery);
    this.#client.setQueryData(dataKey, (old: Data) =>
      this.addTimeSeriesData(old, data)
    );
  }

  requestIsCached(requestQuery: Request) {
    const requests = this.getTimeSeriesRequests(requestQuery, {
      status: 'success',
      inViewport: true,
    });
    const mergedIntervals = collapseRequests(requests);
    /**
     * cached requests should completely cover the request query
     * without any gaps this means they are all
     * collapsible into 1 request query
     */
    if (mergedIntervals.length !== 1) return false;

    const [mergedInterval] = mergedIntervals;

    const { startDate: cachedStartDate, endDate: cachedEndDate } = asComparable(
      mergedInterval.viewport
    );
    const { startDate, endDate } = asComparable(requestQuery.viewport);

    return cachedStartDate <= startDate && cachedEndDate >= endDate;
  }
}
