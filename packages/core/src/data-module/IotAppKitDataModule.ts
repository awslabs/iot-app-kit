import { v4 } from 'uuid';
import SubscriptionStore from './subscription-store/subscriptionStore';
import {
  DataModule,
  DataModuleSubscription,
  DataStreamCallback,
  DataStreamQuery,
  RequestInformation,
  RequestInformationAndRange,
  Subscription,
  SubscriptionUpdate,
} from './types.d';
import { DataStreamsStore, CacheSettings } from './data-cache/types';
import DataSourceStore from './data-source-store/dataSourceStore';
import { SubscriptionResponse } from '../iotsitewise/time-series-data/types.d';
import { DataCache } from './data-cache/dataCacheWrapped';
import { TimeSeriesDataRequest } from './data-cache/requestTypes';
import { requestRange } from './data-cache/requestRange';
import { getDateRangesToRequest } from './data-cache/caching/caching';
import { viewportEndDate, viewportStartDate } from '../common/viewport';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../common/time';

export const DEFAULT_CACHE_SETTINGS = {
  ttlDurationMapping: {
    [1.2 * MINUTE_IN_MS]: 0,
    [3 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
    [20 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
  },
};

interface IotAppKitDataModuleConfiguration {
  initialDataCache?: DataStreamsStore;
  cacheSettings?: Partial<CacheSettings>;
}

export class IotAppKitDataModule implements DataModule {
  private dataCache: DataCache;

  private subscriptions: SubscriptionStore;

  private dataSourceStore = new DataSourceStore();

  private cacheSettings: CacheSettings;

  /**
   * Create a new data module, optionally with a pre-hydrated data cache.
   *
   */
  constructor(configuration: IotAppKitDataModuleConfiguration = {}) {
    const { initialDataCache, cacheSettings } = configuration;

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

  public registerDataSource = this.dataSourceStore.registerDataSource;

  /**
   * Fulfill query
   *
   * Ensure that all requests are initiated required to fulfill the entire query, from start to end.
   * Takes into account the current state of the cache, to determine which data has already been requested, or has expired
   * segments within the cache.
   */
  private fulfillQueries = ({
    queries,
    start,
    end,
    request,
  }: {
    queries: DataStreamQuery[];
    start: Date;
    end: Date;
    request: TimeSeriesDataRequest;
  }) => {
    const requestedStreams = this.dataSourceStore.getRequestsFromQueries({ queries, request });

    const isRequestedDataStream = ({ id, resolution }: RequestInformation) =>
      this.dataCache.shouldRequestDataStream({ dataStreamId: id, resolution });

    const requiredStreams = requestedStreams.filter(isRequestedDataStream);

    // Get the date range to request data for.
    // Pass in 'now' for max since we don't want to request for data in the future yet - it doesn't exist yet.
    const { start: adjustedStart, end: adjustedEnd } = requestRange(
      {
        start,
        end,
        max: new Date(),
      },
      request.settings?.requestBuffer
    );

    const requests = requiredStreams
      .map(({ resolution, id, cacheSettings }) => {
        const dateRanges = getDateRangesToRequest({
          store: this.dataCache.getState(),
          start: adjustedStart,
          end: adjustedEnd,
          resolution,
          dataStreamId: id,
          cacheSettings: { ...this.cacheSettings, ...cacheSettings },
        });

        return {
          dateRanges,
          request: { id, resolution },
        };
      })
      .flatMap(({ dateRanges, request }) =>
        dateRanges.map(([rangeStart, rangeEnd]) => ({ start: rangeStart, end: rangeEnd, ...request }))
      );

    /** Indicate within the cache that the following queries are being requested */
    requests.forEach(({ start: reqStart, end: reqEnd, id, resolution }) =>
      this.dataCache.onRequest({
        id,
        resolution,
        first: reqStart,
        last: reqEnd,
      })
    );

    if (requests.length > 0) {
      this.registerRequest({ queries, request }, requests);
    }
  };

  public subscribeToDataStreams = <Query extends DataStreamQuery>(
    { queries, request }: DataModuleSubscription<Query>,
    callback: DataStreamCallback
  ): SubscriptionResponse<Query> => {
    const subscriptionId = v4();

    this.subscriptions.addSubscription(subscriptionId, {
      queries,
      request,
      emit: callback,
      fulfill: () => {
        this.fulfillQueries({
          start: viewportStartDate(request.viewport),
          end: viewportEndDate(request.viewport),
          queries,
          request,
        });
      },
    });

    /**
     * subscription management
     */

    const unsubscribe = () => {
      this.unsubscribe(subscriptionId);
    };

    const update = (subscriptionUpdate: SubscriptionUpdate<Query>) => {
      this.update(subscriptionId, subscriptionUpdate);
    };

    return { unsubscribe, update };
  };

  private update = <Query extends DataStreamQuery>(
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate<Query>
  ): void => {
    const subscription = this.subscriptions.getSubscription(subscriptionId);

    const updatedSubscription = Object.assign({}, subscription, subscriptionUpdate) as Subscription;

    if ('queries' in updatedSubscription) {
      this.subscriptions.updateSubscription(subscriptionId, {
        ...updatedSubscription,
        fulfill: () => {
          this.fulfillQueries({
            start: viewportStartDate(updatedSubscription.request.viewport),
            end: viewportEndDate(updatedSubscription.request.viewport),
            queries: updatedSubscription.queries,
            request: updatedSubscription.request,
          });
        },
      });
    }
  };

  private registerRequest = <Query extends DataStreamQuery>(
    subscription: { queries: Query[]; request: TimeSeriesDataRequest },
    requestInformations: RequestInformationAndRange[]
  ): void => {
    const { queries, request } = subscription;

    queries.forEach((query) =>
      this.dataSourceStore.initiateRequest(
        {
          request,
          query,
          onSuccess: this.dataCache.onSuccess(request),
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
