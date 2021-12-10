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
import { DataStreamsStore } from './data-cache/types';
import DataSourceStore from './data-source-store/dataSourceStore';
import { SubscriptionResponse } from '../data-sources/site-wise/types.d';
import { DataCache } from './data-cache/dataCacheWrapped';
import { Request } from './data-cache/requestTypes';
import { requestRange } from './data-cache/requestRange';
import { getDateRangesToRequest } from './data-cache/caching/caching';
import { viewportEndDate, viewportStartDate } from '../common/viewport';

export class IotAppKitDataModule implements DataModule {
  private dataCache: DataCache;

  private subscriptions: SubscriptionStore;

  private dataSourceStore = new DataSourceStore();

  /**
   * Create a new data module, optionally with a pre-hydrated data cache.
   *
   */
  constructor(initialDataCache?: DataStreamsStore) {
    this.dataCache = new DataCache(initialDataCache);
    this.subscriptions = new SubscriptionStore({ dataSourceStore: this.dataSourceStore, dataCache: this.dataCache });
  }

  public registerDataSource = this.dataSourceStore.registerDataSource;

  /**
   * Fulfill query
   *
   * Ensure that all requests are initiated required to fulfill the entire query, from start to end.
   * Takes into account the current state of the cache, to determine which data has already been requested, or has expired
   * segments within the cache.
   */
  private fulfillQuery = ({
    query,
    start,
    end,
    requestInfo,
  }: {
    query: DataStreamQuery;
    start: Date;
    end: Date;
    requestInfo: Request;
  }) => {
    const requestedStreams = this.dataSourceStore.getRequestsFromQuery(query);

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
      requestInfo.requestConfig?.requestBuffer
    );

    const requests = requiredStreams
      .map(({ resolution, id }) => {
        const dateRanges = getDateRangesToRequest({
          store: this.dataCache.getState(),
          start: adjustedStart,
          end: adjustedEnd,
          resolution,
          dataStreamId: id,
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
      this.registerRequest({ query, requestInfo }, requests);
    }
  };

  public subscribeToDataStreamsFrom = (source: string, callback: DataStreamCallback) => {
    const subscriptionId = v4();

    this.subscriptions.addSubscription(subscriptionId, {
      source,
      emit: callback,
    });

    /**
     * subscription management
     */
    const unsubscribe = () => {
      this.unsubscribe(subscriptionId);
    };

    return { unsubscribe };
  };

  public subscribeToDataStreams = <Query extends DataStreamQuery>(
    { query, requestInfo }: DataModuleSubscription<Query>,
    callback: DataStreamCallback
  ): SubscriptionResponse<Query> => {
    const subscriptionId = v4();

    this.subscriptions.addSubscription(subscriptionId, {
      query,
      requestInfo,
      emit: callback,
      fulfill: () => {
        this.fulfillQuery({
          start: viewportStartDate(requestInfo.viewport),
          end: viewportEndDate(requestInfo.viewport),
          query,
          requestInfo,
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
    if ('query' in updatedSubscription) {
      this.subscriptions.updateSubscription(subscriptionId, {
        ...updatedSubscription,
        fulfill: () => {
          this.fulfillQuery({
            start: viewportStartDate(updatedSubscription.requestInfo.viewport),
            end: viewportEndDate(updatedSubscription.requestInfo.viewport),
            query: updatedSubscription.query,
            requestInfo: updatedSubscription.requestInfo,
          });
        },
      });
    }
  };

  private registerRequest = <Query extends DataStreamQuery>(
    subscription: { query: Query; requestInfo: Request },
    requestInformations: RequestInformationAndRange[]
  ): void => {
    this.dataSourceStore.initiateRequest(
      {
        requestInfo: subscription.requestInfo,
        query: subscription.query,
        onSuccess: this.dataCache.onSuccess(subscription.requestInfo),
        onError: this.dataCache.onError,
      },
      requestInformations
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
