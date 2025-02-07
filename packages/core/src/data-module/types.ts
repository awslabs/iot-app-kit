import type { AggregateType, Quality } from '@aws-sdk/client-iotsitewise';
import type {
  TimeSeriesDataRequest,
  Viewport,
} from './data-cache/requestTypes';
import type { CacheSettings } from './data-cache/types';
import type { ErrorDetails, Threshold } from '../common/types';

export type { CacheSettings } from './data-cache/types';

export interface StreamAssociation {
  id: DataStreamId;
  type: StreamType;
}

export type Timestamp = number;

export interface DataPointBase<T extends Primitive = Primitive> {
  y: T;
}

export interface DataPoint<T extends Primitive = Primitive>
  extends DataPointBase<T> {
  x: Timestamp;
  quality?: Quality;
}

export type Resolution = number;

export type Primitive = string | number | boolean | null;

export type DataStreamId = string;

export type DataBase = {
  dataStreams: DataStreamBase[];
};

export interface TimeSeriesData extends DataBase {
  dataStreams: DataStream[];
  viewport: Viewport;
  thresholds: Threshold[];
}

// Reference which can be used to associate styles to the associated results from a query
export type RefId = string;

export interface RequestInformation {
  id: DataStreamId;
  resolution: string;
  refId?: RefId;
  cacheSettings?: CacheSettings;
  fetchMostRecentBeforeStart?: boolean;
  fetchMostRecentBeforeEnd?: boolean;
  fetchFromStartToEnd?: boolean;
  aggregationType?: AggregateType;
  // Mechanism to associate some information about how the request should be made
  meta?: Record<string, string | number | boolean>;
}

export interface RequestInformationAndRange extends RequestInformation {
  start: Date;
  end: Date;
}

export type DataType = 'NUMBER' | 'STRING' | 'BOOLEAN';

export type StreamType = 'ALARM' | 'ANOMALY' | 'ALARM_THRESHOLD';

export type ComparisonOperator =
  | 'LT'
  | 'GT'
  | 'LTE'
  | 'GTE'
  | 'EQ'
  | 'CONTAINS';

export type StatusIconType =
  | 'error'
  | 'active'
  | 'normal'
  | 'acknowledged'
  | 'snoozed'
  | 'disabled'
  | 'latched';

export interface DataStreamBase<T extends Primitive = Primitive> {
  data: DataPointBase<T>[];
  error?: ErrorDetails;
  dataType?: DataType;
  // Mechanism to associate some information about the data stream
  meta?: Record<string, string | number | boolean>;
}

export interface DataStream<T extends Primitive = Primitive>
  extends DataStreamBase<T> {
  id: DataStreamId;
  data: DataPoint<T>[];
  resolution: number;
  aggregationType?: AggregateType;
  refId?: string;
  name?: string;
  detailedName?: string;
  color?: string;
  unit?: string;
  streamType?: StreamType;
  associatedStreams?: StreamAssociation[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  numOutgoingRequests?: number;
  assetName?: string;
}

export type DataSource<Query extends DataStreamQuery = AnyDataStreamQuery> = {
  initiateRequest: (
    request: DataSourceRequest<Query>,
    requestInformations: RequestInformationAndRange[]
  ) => void;
  getRequestsFromQuery: ({
    query,
    request,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }) => Promise<RequestInformation[]>;
};

export type DataStreamCallback = (
  dataStreams: DataStream[],
  requestInformation: RequestInformationAndRange
) => void;

export type OnSuccessCallback = (
  dataStreams: DataStream[],
  requestInformation: RequestInformationAndRange,
  start: Date,
  end: Date
) => void;

export interface QuerySubscription<Query extends DataStreamQuery> {
  queries: Query[];
  request: TimeSeriesDataRequest;
  emit: (data: TimeSeriesData) => void;
  // Initiate requests for the subscription
  fulfill: VoidFunction;
}

export type Subscription<Query extends DataStreamQuery = AnyDataStreamQuery> =
  QuerySubscription<Query>;

export interface DataModuleSubscription<Query extends DataStreamQuery> {
  request: TimeSeriesDataRequest;
  queries: Query[];
}

export interface DataStreamQuery {
  cacheSettings?: CacheSettings;
}

export type AnyDataStreamQuery = DataStreamQuery & any;

export type ErrorCallback = ({
  id,
  resolution,
  aggregationType,
  error,
}: {
  id: string;
  resolution: number;
  error: ErrorDetails;
  aggregationType?: AggregateType;
}) => void;

export type SubscriptionUpdate<Query extends DataStreamQuery> = Partial<
  Omit<Subscription<Query>, 'emit'>
>;

export interface DataSourceRequest<Query extends DataStreamQuery> {
  request: TimeSeriesDataRequest;
  query: Query;
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
}

export interface StyleSettingsMap {
  [refId: string]: BaseStyleSettings;
}

// Style settings sharable by all components
export interface BaseStyleSettings {
  name?: string;
  detailedName?: string;
  color?: string; // CSS color string, i.e. 'red' or '#ffffff'
  unit?: string;
}

export interface SubscriptionResponse<Query extends DataStreamQuery> {
  /** Unsubscribe from the subscription. This will prevent any of the previously subscribed to data, from being requested by the data-module. */
  unsubscribe: VoidFunction;

  /** Update the subscription. This will immediately evaluate if a new query must be requested */
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => Promise<void>;
}
