import { DataStream, DataStreamId, Resolution } from '@synchro-charts/core';
import { TimeSeriesDataRequest } from './data-cache/requestTypes';
import { Request } from './data-cache/requestTypes';
import {
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  GetAssetPropertyValueCommandInput,
  GetAssetPropertyValueCommandOutput,
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';

export type RequestInformation = { id: DataStreamId; resolution: Resolution };
export type RequestInformationAndRange = RequestInformation & { start: Date; end: Date };

export type DataSourceName = string;

export type DataSource<Query extends DataStreamQuery = AnyDataStreamQuery> = {
  // An identifier for the name of the source, i.e. 'site-wise', 'roci', etc..
  name: DataSourceName; // this is unique
  initiateRequest: (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => void;
  getRequestsFromQuery: ({
    query,
    requestInfo,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }) => RequestInformation[];
};

export type DataStreamCallback = (dataStreams: DataStream[]) => void;

export type QuerySubscription<Query extends DataStreamQuery> = {
  query: Query;
  request: TimeSeriesDataRequest;
  emit: DataStreamCallback;
  // Initiate requests for the subscription
  fulfill: () => void;
};

export type Subscription<Query extends DataStreamQuery = AnyDataStreamQuery> = QuerySubscription<Query>;

export type DataModuleSubscription<Query extends DataStreamQuery> = {
  request: TimeSeriesDataRequest;
  query: Query;
};

export type DataStreamQuery = {
  source: DataSourceName;
};

export type AnyDataStreamQuery = DataStreamQuery & any;

export type ErrorCallback = ({ id, resolution, error }) => void;

export type SubscriptionUpdate<Query extends DataStreamQuery> = Partial<Omit<Subscription<Query>, 'emit'>>;

export type DataSourceRequest<Query extends DataStreamQuery> = {
  request: TimeSeriesDataRequest;
  query: Query;
  onSuccess: DataStreamCallback;
  onError: ErrorCallback;
};

/**
 * Subscribe to data streams
 *
 * Adds a subscription to the data-module.
 * The data-module will ensure that the requested data is provided to the subscriber.
 */
export type SubscribeToDataStreams = <Query extends DataStreamQuery>(
  dataModule: DataModule,
  { query, requestInfo }: DataModuleSubscription<Query>,
  callback: DataStreamCallback
) => {
  unsubscribe: () => void;
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};

type SubscribeToDataStreamsPrivate = <Query extends DataStreamQuery>(
  { query, requestInfo }: DataModuleSubscription<Query>,
  callback: DataStreamCallback
) => {
  unsubscribe: () => void;
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};

/**
 * Subscribe to data streams from a custom data source
 *
 * Adds a subscription to the data-module, pointing to some existing source
 */
export type SubscribeToDataStreamsFrom = (
  dataModule: DataModule,
  source: string,
  emit: DataStreamCallback
) => {
  unsubscribe: () => void;
};

type SubscribeToDataStreamsFromPrivate = (
  source: string,
  emit: DataStreamCallback
) => {
  unsubscribe: () => void;
};

export type SiteWiseAssetDataSource = {
  describeAsset: (input: DescribeAssetCommandInput) => Promise<DescribeAssetCommandOutput>;
  getPropertyValue: (input: GetAssetPropertyValueCommandInput) => Promise<GetAssetPropertyValueCommandOutput>;
  describeAssetModel: (input: DescribeAssetModelCommandInput) => Promise<DescribeAssetModelCommandOutput>;
  listAssets: (input: ListAssetsCommandInput) => Promise<ListAssetsCommandOutput>;
  listAssociatedAssets: (input: ListAssociatedAssetsCommandInput) => Promise<ListAssociatedAssetsCommandOutput>;
};

/**
 * Register custom data source to the data module.
 */
export type RegisterDataSource = <Query extends DataStreamQuery>(
  dataModule: DataModule,
  dataSource: DataSource<Query>
) => void;

/**
 * The core of the IoT App Kit, manages the data, and getting data to those who subscribe.
 */
export interface DataModule {
  registerDataSource: RegisterDataSourcePrivate;
  subscribeToDataStreams: SubscribeToDataStreamsPrivate;
}
