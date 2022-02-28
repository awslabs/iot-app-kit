import { DataStreamId, MinimalViewPortConfig, Primitive } from '@synchro-charts/core';
import { TimeSeriesDataRequest } from './data-cache/requestTypes';
export { CacheSettings } from './data-cache/types';
import { CacheSettings } from './data-cache/types';
import { DataPoint, StreamAssociation } from '@synchro-charts/core';
import { ErrorDetails } from '../common/types';

export type TimeSeriesData = {
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
};

// Reference which can be used to associate styles to the associated results from a query
export type RefId = string;
export type RequestInformation = {
  id: DataStreamId;
  resolution: string;
  refId?: RefId;
  cacheSettings?: CacheSettings;
};
export type RequestInformationAndRange = RequestInformation & { start: Date; end: Date };

export type DataSourceName = string;

export type DataType = 'NUMBER' | 'STRING' | 'BOOLEAN';

export type StreamType = 'ALARM' | 'ANOMALY' | 'ALARM_THRESHOLD';

export interface DataStream<T extends Primitive = Primitive> {
  id: DataStreamId;
  data: DataPoint<T>[];
  aggregates?: {
    [resolution: number]: DataPoint<T>[] | undefined;
  };
  resolution: number;
  dataType?: DataType;
  refId?: string;
  name?: string;
  detailedName?: string;
  color?: string;
  unit?: string;
  streamType?: StreamType;
  associatedStreams?: StreamAssociation[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  error?: ErrorDetails;
}

export type DataSource<Query extends DataStreamQuery = AnyDataStreamQuery> = {
  // An identifier for the name of the source, i.e. 'site-wise', 'roci', etc..
  name: DataSourceName; // this is unique
  initiateRequest: (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => void;
  getRequestsFromQuery: ({ query, request }: { query: Query; request: TimeSeriesDataRequest }) => RequestInformation[];
};

export type DataStreamCallback = (dataStreams: DataStream[], typeOfRequest: TypeOfRequest) => void;
export type OnSuccessCallback = (
  dataStreams: DataStream[],
  typeOfRequest: TypeOfRequest,
  start: Date,
  end: Date
) => void;

export type TypeOfRequest = 'fetchMostRecentBeforeStart' | 'fetchMostRecentBeforeEnd' | 'fetchFromStartToEnd';

export type QuerySubscription<Query extends DataStreamQuery> = {
  queries: Query[];
  request: TimeSeriesDataRequest;
  emit: (data: TimeSeriesData) => void;
  // Initiate requests for the subscription
  fulfill: () => void;
};

export type Subscription<Query extends DataStreamQuery = AnyDataStreamQuery> = QuerySubscription<Query>;

export type DataModuleSubscription<Query extends DataStreamQuery> = {
  request: TimeSeriesDataRequest;
  queries: Query[];
};

export type DataStreamQuery = {
  source: DataSourceName;
  cacheSettings?: CacheSettings;
};

export type AnyDataStreamQuery = DataStreamQuery & any;

export type ErrorCallback = ({
  id,
  resolution,
  error,
}: {
  id: string;
  resolution: number;
  error: ErrorDetails;
}) => void;

export type SubscriptionUpdate<Query extends DataStreamQuery> = Partial<Omit<Subscription<Query>, 'emit'>>;

export type DataSourceRequest<Query extends DataStreamQuery> = {
  request: TimeSeriesDataRequest;
  query: Query;
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
};

/**
 * Subscribe to data streams
 *
 * Adds a subscription to the data-module.
 * The data-module will ensure that the requested data is provided to the subscriber.
 */
type SubscribeToDataStreams = <Query extends DataStreamQuery>(
  { queries, request }: DataModuleSubscription<Query>,
  callback: (data: TimeSeriesData) => void
) => {
  unsubscribe: () => void;
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};

/**
 * The core of the IoT App Kit, manages the data, and getting data to those who subscribe.
 */
export interface DataModule {
  registerDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;
  subscribeToDataStreams: SubscribeToDataStreams;
}

export type StyleSettingsMap = { [refId: string]: BaseStyleSettings };

// Style settings sharable by all components
export type BaseStyleSettings = {
  name?: string;
  detailedName?: string;
  color?: string; // CSS color string, i.e. 'red' or '#ffffff'
  unit?: string;
};
export type SubscriptionResponse<Query extends DataStreamQuery> = {
  /** Unsubscribe from the subscription. This will prevent any of the previously subscribed to data, from being requested by the data-module. */
  unsubscribe: () => void;

  /** Update the subscription. This will immediately evaluate if a new query must be requested */
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};

// SiteWise specific types - eventually remove these from here
export type AssetPropertyId = string;

export type AssetId = string;

export type PropertyAlias = string;

export type PropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
};

export type AssetQuery = {
  assetId: AssetId;
  properties: PropertyQuery[];
};

export type SiteWiseAssetQuery = {
  assets: AssetQuery[];
};

export type SiteWiseAssetDataStreamQuery = DataStreamQuery & SiteWiseAssetQuery;

export type SiteWiseDataStreamQuery = SiteWiseAssetDataStreamQuery;
