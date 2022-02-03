import {
  DataStreamQuery,
  DataStreamCallback,
  DataModuleSubscription,
  SubscriptionUpdate,
  Subscription,
} from '../data-module/types';
import { DataModuleSession, SessionMetrics } from './types';
import { SiteWiseIotDataModule } from './SiteWiseIotDataModule';

/**
 * Makes sessionized calls via the data module.
 * This is where metrics, statistics and request intercepting can occur
 */
export class SiteWiseIotDataSession<Query extends DataStreamQuery> implements DataModuleSession {
  private module: SiteWiseIotDataModule;
  private metrics: SessionMetrics;
  private update: (subscriptionUpdate: Partial<Omit<Subscription<Query>, 'emit'>>) => void;
  private unsubscribe: () => void;

  constructor(module: SiteWiseIotDataModule, metrics: SessionMetrics) {
    this.module = module;
    this.metrics = metrics;
  }

  public getMetrics(): SessionMetrics {
    return this.metrics;
  }

  public subscribe(subscription: DataModuleSubscription<Query>, callback: DataStreamCallback): void {
    // metrics.count() - intercepting calls can happen here, for example
    const { update, unsubscribe } = this.module.subscribeToDataStreams(subscription, callback);
    this.update = update;
    this.unsubscribe = unsubscribe;
  }

  public updateSubscription(subscriptionUpdate: SubscriptionUpdate<Query>): void {
    this.update(subscriptionUpdate);
  }

  public close(): void {
    this.unsubscribe();
  }
}
