import {
  DataModuleSubscription,
  DataSource,
  DataStreamCallback,
  DataStreamQuery,
  SubscriptionUpdate,
} from './data-module/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise/dist-types/IoTSiteWiseClient';
import { Credentials, Provider } from '@aws-sdk/types';
import { SiteWiseDataStreamQuery } from './iotsitewise/time-series-data/types';
import { IotAppKitDataModule } from './data-module/IotAppKitDataModule';

export * from './components.d';
export * from './data-module/types.d';
export * from './data-sources';
export * from './index';
export * from './data-module/data-cache/requestTypes';
export * from './iotsitewise/time-series-data/types.d';

/** @deprecated - transition to IoTAppKitComponentSession */
export type IoTAppKitSession = {
  subscribeToTimeSeriesData: (
    { queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>,
    callback: DataStreamCallback
  ) => {
    unsubscribe: () => void;
    update: (subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) => void;
  };
  iotsitewise: {
    subscribeToAssetTree: (query: SiteWiseAssetTreeQuery, callback: SiteWiseAssetTreeCallback) => AssetTreeSubscription;
  };
  registerDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;
};

export type IoTAppKitInitInputs =
  | {
      registerDataSources?: boolean;
      iotSiteWiseClient: IoTSiteWiseClient;
    }
  | {
      registerDataSources?: boolean;
      awsCredentials: Credentials | Provider<Credentials>;
      awsRegion: string;
    };

export interface Closeable {
  close(): void;
}

export interface DataModuleSession extends Closeable {}

export interface IoTAppKitComponentSession extends Closeable {
  componentId: string;
  attachDataModuleSession(session: Closeable): void;
  // getComponentMetrics(component: string): SessionMetrics; (TBD)
}

export type QueryBuilder<Subscription, Update, Callback> = {
  (params: Subscription): Query<Subscription, Update, Callback>;
};

export interface Query<Subscription, Update, Callback> {
  build(session: AppKitComponentSession, props?: { [key: string]: any }): Provider<Subscription, Update, Callback>;
}

export interface Provider<Subscription, Update, Callback> {
  subscribe(callback: Callback): void;
  updateSubscription(subscriptionUpdate: Update): void;
  unsubscribe(): void;
}
