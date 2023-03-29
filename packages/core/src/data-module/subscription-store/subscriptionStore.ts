import { DataCache } from '../data-cache/dataCacheWrapped';
import DataSourceStore from '../data-source-store/dataSourceStore';
import RequestScheduler from '../request-scheduler/requestScheduler';
import { viewportEndDate } from '../../common/viewport';
import { maxCacheDuration } from '../data-cache/caching/caching';
import type { DataStreamQuery, Subscription, SubscriptionUpdate } from '../types';
import type { CacheSettings } from '../data-cache/types';

/**
 * Subscription store
 *
 * Manages the collection of subscriptions
 */
export default class SubscriptionStore<Query extends DataStreamQuery> {
  private dataSourceStore: DataSourceStore<Query>;
  private dataCache: DataCache;
  private cacheSettings: CacheSettings;
  private unsubscribeMap: { [subscriberId: string]: () => void } = {};
  private scheduler: RequestScheduler = new RequestScheduler();
  private subscriptions: { [subscriptionId: string]: Subscription } = {};

  constructor({
    dataSourceStore,
    dataCache,
    cacheSettings,
  }: {
    dataSourceStore: DataSourceStore<Query>;
    dataCache: DataCache;
    cacheSettings: CacheSettings;
  }) {
    this.dataCache = dataCache;
    this.dataSourceStore = dataSourceStore;
    this.cacheSettings = cacheSettings;
  }

  async addSubscription(subscriptionId: string, subscription: Subscription<Query>): Promise<void> {
    if (this.subscriptions[subscriptionId] == null) {
      /**
       * If the subscription is query based
       */
      if ('queries' in subscription) {
        subscription.fulfill();

        if ('duration' in subscription.request.viewport) {
          /** has a duration, so periodically request for data without a deadline */
          this.scheduler.create({
            id: subscriptionId,
            cb: () => subscription.fulfill(),
            refreshRate: subscription.request.settings?.refreshRate,
          });
        } else {
          /** has a static start and end, request until data is unexpireable */
          this.scheduler.create({
            id: subscriptionId,
            cb: () => subscription.fulfill(),
            refreshRate: subscription.request.settings?.refreshRate,
            refreshExpiration:
              viewportEndDate(subscription.request.viewport).getTime() +
              Math.max(
                ...subscription.queries.map((query) =>
                  maxCacheDuration({ ...this.cacheSettings, ...query.cacheSettings })
                )
              ),
          });
        }

        const { queries, request } = subscription;

        const requestInfos = await this.dataSourceStore.getRequestsFromQueries({ queries, request });

        // Subscribe to changes from the data cache
        const unsubscribe = this.dataCache.subscribe(requestInfos, (dataStreams) =>
          subscription.emit({ dataStreams, viewport: subscription.request.viewport, thresholds: [] })
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

  async updateSubscription(subscriptionId: string, subscriptionUpdate: SubscriptionUpdate<Query>): Promise<void> {
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

    await this.addSubscription(subscriptionId, updatedSubscription);
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
