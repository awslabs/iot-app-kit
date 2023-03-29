import { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { TimeSeriesDataRequest, Viewport } from './data-cache/requestTypes';
import type { CacheSettings } from './data-cache/types';
import type { ErrorDetails, Threshold } from '../common/types';

export type { CacheSettings } from './data-cache/types';

export type StreamAssociation = {
  id: DataStreamId;
  type: StreamType;
};

export type Timestamp = number;
export type DataPoint<T extends Primitive = Primitive> = {
  x: Timestamp;
  y: T;
};

export type Resolution = number;

export type Primitive = string | number | boolean;

export type DataStreamId = string;

export type TimeSeriesData = {
  dataStreams: DataStream[];
  viewport: Viewport;
  thresholds: Threshold[];
};

// Reference which can be used to associate styles to the associated results from a query
export type RefId = string;

export type RequestInformation = {
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
};
export type RequestInformationAndRange = RequestInformation & { start: Date; end: Date };

export type DataType = 'NUMBER' | 'STRING' | 'BOOLEAN';

export type StreamType = 'ALARM' | 'ANOMALY' | 'ALARM_THRESHOLD';

export type ComparisonOperator = 'LT' | 'GT' | 'LTE' | 'GTE' | 'EQ' | 'CONTAINS';

export type StatusIconType = 'error' | 'active' | 'normal' | 'acknowledged' | 'snoozed' | 'disabled' | 'latched';

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
  // Mechanism to associate some information about the data stream
  meta?: Record<string, string | number | boolean>;
}

export type DataSource<Query extends DataStreamQuery = AnyDataStreamQuery> = {
  initiateRequest: (request: DataSourceRequest<Query>, requestInformations: RequestInformationAndRange[]) => void;
  getRequestsFromQuery: ({
    query,
    request,
  }: {
    query: Query;
    request: TimeSeriesDataRequest;
  }) => Promise<RequestInformation[]>;
};

export type DataStreamCallback = (dataStreams: DataStream[], requestInformation: RequestInformationAndRange) => void;
export type OnSuccessCallback = (
  dataStreams: DataStream[],
  requestInformation: RequestInformationAndRange,
  start: Date,
  end: Date
) => void;

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
  cacheSettings?: CacheSettings;
};

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

export type SubscriptionUpdate<Query extends DataStreamQuery> = Partial<Omit<Subscription<Query>, 'emit'>>;

export type DataSourceRequest<Query extends DataStreamQuery> = {
  request: TimeSeriesDataRequest;
  query: Query;
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
};

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
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => Promise<void>;
};
