import {
  type QueryClient,
  type QueryFilters,
  type QueryStatus,
} from '@tanstack/react-query';
import {
  IntervalTransformer,
  contains,
  getViewportType,
  overlaps,
} from '../intervals';
import { type TimeSeriesDataCacheKeyManager } from './keyManager';
import { type Interval, type Viewport } from '../types';
import { removeExpiredIntervals } from '../intervals/utils/removeExpiredIntervals';

type FilterSettings = {
  status?: QueryStatus;
  refreshRates?: (number | undefined)[];
  intervalTransformer: IntervalTransformer;
};

export abstract class TimeSeriesDataCacheClient<Request, Data> {
  #keyManager: TimeSeriesDataCacheKeyManager<Request>;
  #client: QueryClient;

  constructor({
    keyManager,
    client,
  }: {
    keyManager: TimeSeriesDataCacheKeyManager<Request>;
    client: QueryClient;
  }) {
    this.#keyManager = keyManager;
    this.#client = client;
  }

  abstract matchesRequest(requestA: Request, requestB: Request): boolean;

  abstract filterTimeSeriesData(data: Data[], interval: Interval): Data[];

  abstract addTimeSeriesData(oldData?: Data[], newData?: Data[]): Data[];

  protected fiterTimeSerisDataRequests(
    { request, viewport }: { request: Request; viewport?: Viewport },
    filterSettings: FilterSettings & {
      intervalTransformer: IntervalTransformer;
    }
  ): QueryFilters['predicate'] {
    const { intervalTransformer, status, refreshRates } = filterSettings;

    return (query) => {
      const isTimeSeriesDataRequestExecutionQuery =
        this.#keyManager.isTimeSeriesDataQuery(query.queryKey, ['execution']);

      if (!isTimeSeriesDataRequestExecutionQuery) return false;

      const queryKeyAsRequest = this.#keyManager.toRequest(query.queryKey);

      if (!queryKeyAsRequest) return false;

      const { request: queryRequest, viewport: queryViewport } =
        queryKeyAsRequest;

      if (!queryViewport) return false;

      const isApplicableRefreshRate = refreshRates
        ? refreshRates.includes(queryViewport.refreshRate)
        : true;

      if (!isApplicableRefreshRate) return false;

      let isInViewport = true;
      if (viewport) {
        const viewportInterval = intervalTransformer.toInterval(viewport);
        const queryViewportInterval = intervalTransformer.toInterval(
          queryViewport,
          query.state.dataUpdatedAt
        );
        isInViewport = overlaps(queryViewportInterval)(viewportInterval);
      }

      const matches = this.matchesRequest(request, queryRequest);

      return (
        matches &&
        isInViewport &&
        (status ? query.state.status === status : true)
      );
    };
  }

  getQueryClient() {
    return this.#client;
  }

  getKeyManager() {
    return this.#keyManager;
  }

  cancelTimeSeriesDataRequests(
    options: { request: Request; viewport?: Viewport },
    filterSettings: FilterSettings
  ) {
    // can probably refactor filter to not care about viewport?
    this.#client.cancelQueries({
      predicate: this.fiterTimeSerisDataRequests(options, filterSettings),
    });
    this.#client.removeQueries({
      predicate: this.fiterTimeSerisDataRequests(options, filterSettings),
    });
  }

  getCachedTimeSeriesDataRequestIntervals(request: Request) {
    return this.#client.getQueryData(
      this.#keyManager.toCachedRequestExectutionQueryKey(request)
    ) as Interval[];
  }

  isTimeSeriesDataRequestCached(options: {
    request: Request;
    viewport: Viewport;
  }) {
    const viewportType = getViewportType(options.viewport);
    const now = Date.now();

    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType,
    });
    const intervals = this.getCachedTimeSeriesDataRequestIntervals(
      options.request
    );
    const unexpired = removeExpiredIntervals(intervals, new Date(now));
    return contains(
      unexpired,
      intervalTransformer.toInterval(options.viewport)
    );
  }

  setTimeSeriesRequestData(request: Request, data: Data[]) {
    const dataKey = this.#keyManager.toDataCacheQueryKey(request);
    this.#client.setQueryData(dataKey, (old: Data[]) =>
      this.addTimeSeriesData(old, data)
    );
  }

  setCachedRequestData(request: Request, interval: Interval) {
    const now = new Date();
    const dataKey = this.#keyManager.toCachedRequestExectutionQueryKey(request);
    this.#client.setQueryData(dataKey, (old: Interval[] = []) => {
      const unexpired = removeExpiredIntervals(old, now);
      return [...unexpired, interval];
    });
  }

  getTimeSeriesData({
    request,
    viewport,
  }: {
    request: Request;
    viewport: Viewport;
  }) {
    const viewportType = getViewportType(viewport);
    const now = Date.now();

    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType,
    });

    const dataKey = this.#keyManager.toDataCacheQueryKey(request);
    const data = this.#client.getQueryData(dataKey) as Data[] | undefined;

    if (!data) return undefined;

    const interval = intervalTransformer.toInterval(viewport);

    return this.filterTimeSeriesData(data, interval);
  }
}
