import { DataStreamQuery, DataStreamCallback, DataModuleSubscription } from '../data-module/types';
import { DataModuleSession, SessionMetrics } from './types';
import { SiteWiseIotDataModule } from './SiteWiseIotDataModule';

/**
 * Makes sessionized calls via the data module.
 * This is where metrics, statistics and request intercepting can occur
 */
export class SiteWiseIotDataSession implements DataModuleSession {
  private module: SiteWiseIotDataModule;
  private metrics: SessionMetrics;
  private unsubscribe: () => void;

  constructor(module: SiteWiseIotDataModule, metrics: SessionMetrics) {
    this.module = module;
    this.metrics = metrics;
  }

  public getMetrics(): SessionMetrics {
    return this.metrics;
  }

  public subscribe<Query extends DataStreamQuery>(
    subscription: DataModuleSubscription<Query>,
    callback: DataStreamCallback
  ): void {
    // metrics.count() - intercepting calls can happen here, for example
    const { unsubscribe } = this.module.subscribeToDataStreams(subscription, callback);
    this.unsubscribe = unsubscribe;
  }

  close(): void {
    this.unsubscribe();
  }
}
