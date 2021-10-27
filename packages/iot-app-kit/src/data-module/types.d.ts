import { DataStream, DataStreamId, Resolution } from '@synchro-charts/core';
import { RequestInfo } from './data-cache/requestTypes';

export type RequestInformation = { id: DataStreamId; resolution: Resolution };
export type RequestInformationAndRange = RequestInformation & { start: Date; end: Date };

export type DataSourceName = string;

export type DataSource<Query extends DataStreamQuery = AnyDataStreamQuery> = {
  // An identifier for the name of the source, i.e. 'site-wise', 'roci', etc..
  name: DataSourceName; // this is unique
  initiateRequest: (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => void;
  getRequestsFromQuery: (query: Query) => RequestInformation[];
};

export type DataStreamCallback = (dataStreams: DataStream[]) => void;

export type Subscription<Query extends DataStreamQuery> = {
  query: Query;
  requestInfo: RequestInfo;
  emit: DataStreamCallback;
};

export type DataModuleSubscription<Query extends DataStreamQuery> = {
  requestInfo: RequestInfo;
  query: Query;
};

export type DataStreamQuery = {
  source: DataSourceName;
};

export type AnyDataStreamQuery = DataStreamQuery & any;

export type SubscriptionUpdate<Query extends DataStreamQuery> = Partial<Omit<Subscription<Query>, 'emit'>>;

export type DataSourceRequest<Query extends DataStreamQuery> = {
  requestInfo: RequestInfo;
  query: Query;
  onSuccess: DataStreamCallback;
  onError: Function;
};

type SubscribeToDataStreams = <Query extends DataStreamQuery>(
  { query, requestInfo }: DataModuleSubscription<Query>,
  callback: DataStreamCallback
) => {
  unsubscribe: UnsubscribeFromDataStreams;
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};

/**
 * The core of the IoT App Kit, manages the data, and getting data to those who subscribe.
 */
export interface DataModule {
  /**
   * Register custom data source to the data module.
   */
  registerDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;

  /**
   * Subscribe to data streams
   *
   * Adds a subscription to the data-module.
   * The data-module will ensure that the requested data is provided to the subscriber.
   */
  subscribeToDataStreams: SubscribeToDataStreams;
}
