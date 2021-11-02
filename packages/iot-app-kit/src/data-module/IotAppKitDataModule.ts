import { DataStream } from '@synchro-charts/core';
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
import { toDataStreams } from './data-cache/toDataStreams';
import DataSourceStore from './data-source-store/dataSourceStore';
import { SiteWiseLegacyDataStreamQuery } from '../data-sources/site-wise-legacy/types.d';
import { SubscriptionResponse } from '../data-sources/site-wise/types.d';
import RequestScheduler from './request-scheduler/requestScheduler';
import { DataCache } from './data-cache/dataCacheWrapped';
import { getDateRangesToRequest } from './data-cache/caching/caching';

export class IotAppKitDataModule implements DataModule {
  private dataCache: DataCache;

  private subscriptions = new SubscriptionStore();

  private dataSourceStore = new DataSourceStore();

  private scheduler = new RequestScheduler();

  /**
   * Create a new data module, optionally with a pre-hydrated data cache.
   *
   */
  constructor(initialDataCache?: DataStreamsStore) {
    this.dataCache = new DataCache(initialDataCache);
    this.publishToSubscriptions();
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
    callback,
    subscriptionId,
  }: {
    query: DataStreamQuery;
    start: Date;
    end: Date;
    callback: DataStreamCallback;
    subscriptionId: string;
  }) => {
    const requiredStreams = this.dataSourceStore.getRequestsFromQuery(query);

    // TODO: Account for 'pre-loading' data by increasing the range beyond start to end by some determined buffer, if enabled as an option
    const requests = requiredStreams
      .map(({ resolution, id }) => {
        const dateRanges = getDateRangesToRequest({
          store: this.dataCache.getState(),
          start,
          end,
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

    // TODO: Prevent from requesting when an error is present in the data cache
    /** Indicate within the cache that the following queries are being requested */
    requests.forEach(({ start: reqStart, end: reqEnd, id, resolution }) =>
      this.dataCache.onRequest({
        id,
        resolution,
        first: reqStart,
        last: reqEnd,
      })
    );

    /**
     * Get the data streams which are already present within the cache.
     *
     * If there are data streams present within the data-cache, we will
     * provide that immediately to the subscription.
     * */
    const presentDataStreams = this.getDataStreams(this.dataSourceStore.getRequestsFromQuery(query));
    callback(presentDataStreams);

    if (requests.length > 0) {
      this.registerRequest(this.subscriptions.getSubscription(subscriptionId), requests);
    }
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
    });
    const requestStart: Date =
      'duration' in requestInfo ? new Date(Date.now() - requestInfo.duration) : requestInfo.start;
    const requestEnd: Date = 'duration' in requestInfo ? new Date() : requestInfo.end;
    // call it once
    this.fulfillQuery({
      start: requestStart,
      end: requestEnd,
      query,
      callback,
      subscriptionId,
    });

    // If duration exists, we want to start the request scheduler
    if ('duration' in requestInfo) {
      this.startTick({ query, requestInfo }, callback, subscriptionId);
    }

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

  private startTick<Query extends DataStreamQuery>(
    { query, requestInfo }: DataModuleSubscription<Query>,
    callback: DataStreamCallback,
    subscriptionId: string
  ): void {
    if (!('duration' in requestInfo)) {
      return;
    }
    const cb = ({ start, end }: { start: Date; end: Date }): void =>
      this.fulfillQuery({
        start,
        end,
        query,
        callback,
        subscriptionId,
      });

    this.scheduler.create({
      id: subscriptionId,
      duration: requestInfo.duration,
      cb,
    });
  }

  /**
   * Listen to every data cache change, and provide the data streams for every subscriber.
   *
   * TODO: Only publish when the corresponding data streams have changed.
   */
  private publishToSubscriptions(): void {
    this.dataCache.onChange(() => {
      this.subscriptions.getSubscriptions().forEach((subscription) => this.publishDataStreams(subscription));
    });
  }

  /**
   * Publish the queried data for the provided subscription
   */
  private publishDataStreams<Query extends SiteWiseLegacyDataStreamQuery>({ query, emit }: Subscription<Query>): void {
    const dataStreams = this.getDataStreams(this.dataSourceStore.getRequestsFromQuery(query));
    emit(dataStreams);
  }

  private update = <Query extends DataStreamQuery>(
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate<Query>
  ): void => {
    // Update subscription
    this.subscriptions.updateSubscription(subscriptionId, subscriptionUpdate);

    // Publish updated information
    const subscription = this.subscriptions.getSubscription(subscriptionId);
    const { requestInfo } = subscription;
    const requestStart: Date =
      'duration' in requestInfo ? new Date(Date.now() - requestInfo.duration) : requestInfo.start;
    const requestEnd: Date = 'duration' in requestInfo ? new Date() : requestInfo.end;

    this.fulfillQuery({
      start: requestStart,
      end: requestEnd,
      query: subscription.query,
      callback: subscription.emit,
      subscriptionId,
    });

    // If user updated the request info to contain duration and there is no internal clock attached to the
    // subscription id, we will create an internal clock
    if ('duration' in requestInfo && !this.scheduler.hasScheduler(subscriptionId)) {
      this.startTick({ query: subscription.query, requestInfo }, subscription.emit, subscriptionId);
    } else {
      // Otherwise we can call stop tick.
      this.scheduler.remove(subscriptionId);
    }
  };

  private registerRequest = <Query extends DataStreamQuery>(
    subscription: Subscription<Query>,
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
   * Gets data streams corresponding to the data stream infos.
   */
  private getDataStreams = (requestInformations: RequestInformation[]): DataStream[] =>
    toDataStreams({
      dataStreamsStores: this.dataCache.getState(),
      dataStreamInfo: requestInformations,
    });

  /**
   * Unsubscribe from the data module.
   *
   * Prevents the provided callbacks associated with the given subscription from being called, and prevents
   * the previously queried data streams from being queried any longer.
   */
  private unsubscribe = (subscriptionId: string): void => {
    this.scheduler.remove(subscriptionId);
    this.subscriptions.removeSubscription(subscriptionId);
  };
}
