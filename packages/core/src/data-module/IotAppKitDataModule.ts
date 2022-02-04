import { MinimalViewPortConfig } from '@synchro-charts/core';
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
    viewport,
    request,
    queries,
  }: {
    viewport: MinimalViewPortConfig;
    request: TimeSeriesDataRequest;
    queries: DataStreamQuery[];
  }) => {
    const start = viewportStartDate(request.viewport);
    const end = viewportEndDate(request.viewport);

    const requestedStreams = this.dataSourceStore.getRequestsFromQueries({ queries, request, viewport });

    const isRequestedDataStream = ({ id, resolution }: RequestInformation) =>
      this.dataCache.shouldRequestDataStream({ dataStreamId: id, resolution });

    const requiredStreams = requestedStreams.filter(isRequestedDataStream);

    const requests = requiredStreams
      .map(({ resolution, id, cacheSettings }) => {
        const dateRanges = getDateRangesToRequest({
          store: this.dataCache.getState(),
          start,
          end,
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
    requests.forEach(({ start: reqStart, end: reqEnd, id, resolution }) => {
      this.dataCache.onRequest({
        id,
        resolution,
        first: reqStart,
        last: reqEnd,
      });

      this.registerRequest({ queries, request: { ...request, viewport: { start: reqStart, end: reqEnd } }, viewport });
    });
  };

  private getAdjustedRequest = (request: TimeSeriesDataRequest): TimeSeriesDataRequest => {
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

    return { ...request, viewport: { start, end } };
  };

  public subscribeToDataStreams = <Query extends DataStreamQuery>(
    subscription: DataModuleSubscription<Query>,
    callback: DataStreamCallback
  ): SubscriptionResponse<Query> => {
    const subscriptionId = v4();

    const request = this.getAdjustedRequest(subscription.request);

    const viewport = {
      start: viewportStartDate(subscription.request.viewport),
      end: viewportEndDate(subscription.request.viewport),
    };

    this.subscriptions.addSubscription(subscriptionId, {
      ...subscription,
      request,
      viewport,
      emit: callback,
      fulfill: () => {
        this.fulfillQueries({
          viewport,
          queries: subscription.queries,
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

    const request = this.getAdjustedRequest(updatedSubscription.request);

    const viewport = {
      start: viewportStartDate(updatedSubscription.request.viewport),
      end: viewportEndDate(updatedSubscription.request.viewport),
    };

    if ('queries' in updatedSubscription) {
      this.subscriptions.updateSubscription(subscriptionId, {
        ...updatedSubscription,
        request,
        viewport,
        fulfill: () => {
          this.fulfillQueries({
            viewport,
            queries: updatedSubscription.queries,
            request,
          });
        },
      });
    }
  };

  private registerRequest = <Query extends DataStreamQuery>(subscription: {
    queries: Query[];
    request: TimeSeriesDataRequest;
    viewport: MinimalViewPortConfig;
  }): void => {
    const { queries, request, viewport } = subscription;

    queries.forEach((query) =>
      this.dataSourceStore.initiateRequest({
        request,
        query,
        viewport,
        onSuccess: this.dataCache.onSuccess(request),
        onError: this.dataCache.onError,
      })
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
