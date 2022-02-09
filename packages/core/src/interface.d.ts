import {
  DataModule,
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
import { SiteWiseAssetModule } from './asset-modules';
import { TimeSeriesData, TimeSeriesDataRequestSettings } from './interface';

export * from './components.d';
export * from './data-module/types.d';
export * from './data-sources';
export * from './index';
export * from './data-module/data-cache/requestTypes';
export * from './iotsitewise/time-series-data/types.d';

export type IoTAppKitSession = {
  subscribeToTimeSeriesData: (
    { queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>,
    callback: (data: TimeSeriesData) => void
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

export interface IoTAppKit {
  session: (componentId: string) => IoTAppKitComponentSession;
  registerTimeSeriesDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;
}

export interface Closeable {
  close(): void;
}

export interface DataModuleSession extends Closeable {}

export interface IoTAppKitComponentSession extends Closeable {
  componentId: string;
  attachDataModuleSession(session: DataModuleSession): void;
}

export interface Query<Provider, Params> {
  build(session: IoTAppKitComponentSession, params?: Params): Provider;
}

export interface TimeSeriesQuery<Provider> extends Query<Provider, TimeSeriesDataRequestSettings> {}

export interface Provider<DataType> {
  subscribe(callback: (data: DataType) => void): void;
  unsubscribe(): void;
}
