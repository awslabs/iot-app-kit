import { v4 } from 'uuid';
import SubscriptionStore from './subscription-store/subscriptionStore';
import DataSourceStore from './data-source-store/dataSourceStore';
import { DataCache } from './data-cache/dataCacheWrapped';
import { requestRange } from './data-cache/requestRange';
import { getRequestInformations } from './data-cache/caching/caching';
import { viewportEndDate, viewportStartDate } from '../common/viewport';
import { MINUTE_IN_MS, parseDuration, SECOND_IN_MS } from '../common/time';
import type {
  DataModuleSubscription,
  DataSource,
  DataStream,
  DataStreamQuery,
  RequestInformation,
  RequestInformationAndRange,
  SubscriptionResponse,
  SubscriptionUpdate,
  TimeSeriesData,
} from './types';
import type { DataStreamsStore, CacheSettings } from './data-cache/types';
import type {
  TimeSeriesDataRequest,
  TimeSeriesDataRequestSettings,
  Viewport,
} from './data-cache/requestTypes';

export const DEFAULT_CACHE_SETTINGS = {
  ttlDurationMapping: {
    [1.2 * MINUTE_IN_MS]: SECOND_IN_MS,
    [3 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
    [20 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
  },
};

interface IotAppKitDataModuleConfiguration {
  initialDataCache?: DataStreamsStore;
  cacheSettings?: Partial<CacheSettings>;
}

export class TimeSeriesDataModule<Query extends DataStreamQuery> {
  private dataCache: DataCache;

  private subscriptions: SubscriptionStore<Query>;

  private dataSourceStore: DataSourceStore<Query>;

  private cacheSettings: CacheSettings;

  /**
   * Create a new data module, optionally with a pre-hydrated data cache.
   *
   */
  constructor(
    dataSource: DataSource<Query>,
    configuration: IotAppKitDataModuleConfiguration = {}
  ) {
    const { initialDataCache, cacheSettings } = configuration;

    this.dataSourceStore = new DataSourceStore(dataSource);
    this.dataCache = new DataCache(initialDataCache);
    this.cacheSettings = {
      ...DEFAULT_CACHE_SETTINGS,
      ...cacheSettings,
    };
    this.subscriptions = new SubscriptionStore({
      dataSourceStore: this.dataSourceStore,
      dataCache: this.dataCache,
      cacheSettings: this.cacheSettings,
    });
  }

  /**
   * Fulfill query
   *
   * Ensure that all requests are initiated required to fulfill the entire query, from start to end.
   * Takes into account the current state of the cache, to determine which data has already been requested, or has expired
   * segments within the cache.
   */
  private fulfillQueries = async ({
    viewport,
    request,
    queries,
  }: {
    viewport: Viewport;
    request: TimeSeriesDataRequest;
    queries: Query[];
  }) => {
    const requestedStreams = await this.dataSourceStore.getRequestsFromQueries({
      queries,
      request,
    });

    const isRequestedDataStream = ({
      id,
      resolution,
      aggregationType,
    }: RequestInformation) =>
      this.dataCache.shouldRequestDataStream({
        dataStreamId: id,
        resolution: parseDuration(resolution),
        aggregationType,
      });

    const requiredStreams = requestedStreams.filter(isRequestedDataStream);

    const requests = requiredStreams
      .map(({ resolution, id, cacheSettings, aggregationType, meta }) =>
        getRequestInformations({
          request,
          meta,
          store: this.dataCache.getState(),
          start: viewportStartDate(viewport),
          end: viewportEndDate(viewport),
          aggregationType,
          resolution,
          dataStreamId: id,
          cacheSettings: { ...this.cacheSettings, ...cacheSettings },
        })
      )
      .flat();

    requests.forEach(this.dataCache.onRequest);

    if (requests.length > 0) {
      this.registerRequest({ queries, request }, requests);
    }
  };

  private getAdjustedViewport = (
    request: TimeSeriesDataRequest
  ): { start: Date; end: Date } => {
    // Get the date range to request data for.
    // Pass in 'now' for max since we don't want to request for data in the future yet - it doesn't exist yet.
    const { start, end } = requestRange(
      {
        start: viewportStartDate(request.viewport),
        end: viewportEndDate(request.viewport),
        max: new Date(),
      },
      request.settings?.requestBuffer
    );

    return { start, end };
  };

  public getCachedDataStreams = async ({
    viewport,
    queries,
    emitDataStreams,
    settings,
  }: {
    viewport: Viewport;
    queries: Query[];
    emitDataStreams: (dataStreams: DataStream[]) => void;
    settings?: TimeSeriesDataRequestSettings;
  }) => {
    const requestedStreams = await this.dataSourceStore.getRequestsFromQueries({
      queries,
      request: { viewport, settings },
    });

    // create request information on every dataStream requested
    // so they can be used to get cached data
    const requestInformations = requestedStreams.map((stream) => ({
      start: viewportStartDate(viewport),
      end: viewportEndDate(viewport),
      ...stream,
    })) as RequestInformationAndRange[];

    const unsubscribe = this.dataCache.getCachedDataForRange(
      requestInformations,
      emitDataStreams
    );
    return unsubscribe;
  };

  public subscribeToDataStreams = (
    { queries, request }: DataModuleSubscription<Query>,
    callback: (data: TimeSeriesData) => void
  ): SubscriptionResponse<Query> => {
    const subscriptionId = v4();

    this.subscriptions.addSubscription(subscriptionId, {
      queries,
      request,
      emit: callback,
      fulfill: () => {
        const viewport = this.getAdjustedViewport(request);
        if (viewport.start < viewport.end) {
          this.fulfillQueries({
            viewport,
            queries,
            request,
          });
        }
      },
    });

    /**
     * subscription management
     */

    const unsubscribe = () => {
      this.unsubscribe(subscriptionId);
    };

    const update = (subscriptionUpdate: SubscriptionUpdate<Query>) =>
      this.update(subscriptionId, subscriptionUpdate);

    return { unsubscribe, update };
  };

  private update = async (
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate<Query>
  ): Promise<void> => {
    const subscription = this.subscriptions.getSubscription(subscriptionId);

    const updatedSubscription = { ...subscription, ...subscriptionUpdate };

    if ('queries' in updatedSubscription) {
      return this.subscriptions.updateSubscription(subscriptionId, {
        ...updatedSubscription,
        fulfill: () => {
          this.fulfillQueries({
            viewport: this.getAdjustedViewport(updatedSubscription.request),
            queries: updatedSubscription.queries,
            request: updatedSubscription.request,
          });
        },
      });
    }
  };

  private registerRequest = (
    subscription: { queries: Query[]; request: TimeSeriesDataRequest },
    requestInformations: RequestInformationAndRange[]
  ): void => {
    const { queries, request } = subscription;

    queries.forEach((query) =>
      this.dataSourceStore.initiateRequest(
        {
          request,
          query,
          onSuccess: this.dataCache.onSuccess,
          onError: this.dataCache.onError,
        },
        requestInformations
      )
    );
  };

  /**
   * Unsubscribe from the data module.
   *
   * Prevents the provided callbacks associated with the given subscription from being called, and prevents
   * the previously queried data streams from being queried any longer.
   */
  private unsubscribe = (subscriptionId: string): void => {
    this.subscriptions.removeSubscription(subscriptionId);
  };
}
