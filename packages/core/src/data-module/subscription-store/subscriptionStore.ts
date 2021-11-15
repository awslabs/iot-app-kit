import { AnyDataStreamQuery, DataStreamQuery, Subscription, SubscriptionUpdate } from '../types.d';
import { DataCache } from '../data-cache/dataCacheWrapped';
import DataSourceStore from '../data-source-store/dataSourceStore';
import RequestScheduler from '../request-scheduler/requestScheduler';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { parseDuration } from '../../common/time';

/**
 * Subscription store
 *
 * Manages the collection of subscriptions
 */
export default class SubscriptionStore {
  private dataSourceStore: DataSourceStore;
  private dataCache: DataCache;
  private unsubscribeMap: { [subscriberId: string]: Function } = {};
  private scheduler: RequestScheduler = new RequestScheduler();
  private subscriptions: { [subscriptionId: string]: Subscription<AnyDataStreamQuery> } = {};

  constructor({ dataSourceStore, dataCache }: { dataSourceStore: DataSourceStore; dataCache: DataCache }) {
    this.dataCache = dataCache;
    this.dataSourceStore = dataSourceStore;
  }

  addSubscription<Query extends DataStreamQuery>(subscriptionId: string, subscription: Subscription<Query>): void {
    if (this.subscriptions[subscriptionId] == null) {
      /**
       * If the subscription is query based
       */
      if ('query' in subscription) {
        subscription.fulfill();

        if ('duration' in subscription.requestInfo.viewport) {
          /** has a duration, so periodically request for data */
          this.scheduler.create({
            id: subscriptionId,
            cb: () => subscription.fulfill(),
            duration: parseDuration((subscription.requestInfo.viewport as MinimalLiveViewport).duration),
            refreshRate: subscription.requestInfo.refreshRate,
          });
        }

        // Subscribe to changes from the data cache
        const unsubscribe = this.dataCache.subscribe(
          this.dataSourceStore.getRequestsFromQuery(subscription.query),
          subscription.emit
        );

        this.unsubscribeMap[subscriptionId] = () => {
          // unsubscribe from listening to the data cache changes
          unsubscribe();

          // unsubscribe from re-occurring requests
          if (this.scheduler.isScheduled(subscriptionId)) {
            this.scheduler.remove(subscriptionId);
          }
        };

        this.subscriptions[subscriptionId] = subscription;
      }
    } else {
      throw new Error(
        `Attempted to add a subscription with an id of "${subscriptionId}", but the provided subscriptionId is already present.`
      );
    }
  }

  updateSubscription<Query extends DataStreamQuery>(
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate<Query>
  ): void {
    if (this.subscriptions[subscriptionId] == null) {
      throw new Error(
        `Attempted to update a subscription with an id of "${subscriptionId}", but the requested subscription does not exist.`
      );
    }

    const updatedSubscription = {
      ...this.subscriptions[subscriptionId],
      ...subscriptionUpdate,
    };

    this.removeSubscription(subscriptionId);

    this.addSubscription(subscriptionId, updatedSubscription);
  }

  removeSubscription = (subscriptionId: string): void => {
    if (this.subscriptions[subscriptionId] == null) {
      throw new Error(
        `Attempted to remove a subscription with an id of "${subscriptionId}", but the requested subscription does not exist.`
      );
    }

    if (this.unsubscribeMap[subscriptionId]) {
      this.unsubscribeMap[subscriptionId]();
      delete this.unsubscribeMap[subscriptionId];
    }

    delete this.subscriptions[subscriptionId];
  };

  getSubscriptions = (): Subscription[] => Object.values(this.subscriptions);

  getSubscription = (subscriptionId: string): Subscription => this.subscriptions[subscriptionId];
}
