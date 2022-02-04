import { DataStream, SubscriptionUpdate } from '../interface';

export interface Closeable {
  close(): void;
}

export interface DataModuleSession extends Closeable {}

export type SessionStatistics = {};

export interface SessionMetrics {
  startRequest(requestId: string): void;
  endRequest(requestId: string, wasCached?: boolean): void;
  errorRequest(requestId: string, error: string): void;
  cancelRequest(requestId: string, error: string): void;
  statistics(): SessionStatistics;
}

export interface AppKitComponentSession extends Closeable {
  componentId: string; // unique identifier to help manage component sessions
  attachDataModuleSession(session: Closeable): void; // allow for component to clean up session on unmount()
  getSessionMetrics(dataModuleName: string): SessionMetrics; // 1 metric client per data module per component
}

export interface Provider<Update, Callback> {
  subscribe(callback: Callback): void;
  updateSubscription(subscriptionUpdate: Update): void;
  unsubscribe(): void;
}

export type TimeSeriesData = {
  streams: DataStream[];
};

export type QueryBuilder<Subscription, Update, Callback> = {
  (params: Subscription): Query<Subscription, Update, Callback>;
};

export interface Query<Subscription, Update, Callback> {
  params: Subscription;
  build(session: AppKitComponentSession, props?: { [key: string]: any }): Provider<Update, Callback>;
}
