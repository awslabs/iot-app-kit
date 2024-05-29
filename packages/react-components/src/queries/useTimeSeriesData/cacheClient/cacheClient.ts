import { QueryClient, QueryFilters, QueryStatus } from '@tanstack/react-query';
import {
  IntervalTransformer,
  contains,
  getViewportType,
  overlaps,
} from '../intervals';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { TimeSeriesDataCacheKeyManager } from './keyManager';
import { Interval, Viewport } from '../types';

type FilterSettings = {
  status?: QueryStatus;
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

  abstract filterTimeSeriesData(data: Data, interval: Interval): Data;

  abstract addTimeSeriesData(oldData?: Data, newData?: Data): Data;

  protected fiterTimeSerisDataRequests(
    { request, viewport }: { request: Request; viewport?: Viewport },
    filterSettings: FilterSettings & {
      intervalTransformer: IntervalTransformer;
    }
  ): QueryFilters['predicate'] {
    const { intervalTransformer, status } = filterSettings;

    return (query) => {
      const isTimeSeriesDataRequestExecutionQuery =
        this.#keyManager.isTimeSeriesDataQuery(query.queryKey, ['execution']);

      if (!isTimeSeriesDataRequestExecutionQuery) return false;

      const queryKeyAsRequest = this.#keyManager.toRequest(query.queryKey);

      if (!queryKeyAsRequest) return false;

      const { request: queryRequest, viewport: queryViewport } =
        queryKeyAsRequest;

      if (!queryViewport) return false;

      let isInViewport = true;
      if (viewport) {
        const viewportInterval = intervalTransformer.toInterval(viewport);
        const queryViewportInterval =
          intervalTransformer.toInterval(queryViewport);
        isInViewport = overlaps(queryViewportInterval)(viewportInterval);
      }

      return (
        this.matchesRequest(request, queryRequest) &&
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
    this.#client.cancelQueries({
      predicate: this.fiterTimeSerisDataRequests(options, filterSettings),
    });
    this.#client.removeQueries({
      predicate: this.fiterTimeSerisDataRequests(options, filterSettings),
    });
  }

  getTimeSeriesDataRequestViewports(
    options: { request: Request; viewport?: Viewport },
    filterSettings: FilterSettings
  ): Viewport[] {
    const queries = this.#client.getQueriesData({
      predicate: this.fiterTimeSerisDataRequests(options, filterSettings),
    });

    return createNonNullableList(
      queries.map(([queryKey]) => {
        return this.#keyManager.toRequest(queryKey)?.viewport;
      })
    );
  }

  timeSeriesDataRequestIsCached(options: {
    request: Request;
    viewport: Viewport;
  }) {
    const viewportType = getViewportType(options.viewport);
    const now = Date.now();

    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType,
    });

    const requestInterval = intervalTransformer.toInterval(options.viewport);

    const cachedViewports = this.getTimeSeriesDataRequestViewports(options, {
      intervalTransformer,
      status: 'success',
    });

    const intervals = cachedViewports.map((i) =>
      intervalTransformer.toInterval(i)
    );

    return contains(intervals, requestInterval);
  }

  setTimeSeriesRequestData(request: Request, data: Data) {
    const dataKey = this.#keyManager.toDataCacheQueryKey(request);
    this.#client.setQueryData(dataKey, (old: Data) =>
      this.addTimeSeriesData(old, data)
    );
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
    const data = this.#client.getQueryData(dataKey) as Data | undefined;

    if (!data) return undefined;

    const interval = intervalTransformer.toInterval(viewport);

    return this.filterTimeSeriesData(data, interval);
  }
}
