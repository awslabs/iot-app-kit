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

export * from './components.d';
export * from './data-module/types.d';
export * from './data-sources';
export * from './index';
export * from './data-module/data-cache/requestTypes';
export * from './iotsitewise/time-series-data/types.d';

export interface IoTAppKit {
  session: (componentId: string) => IoTAppKitComponentSession;
  registerTimeSeriesDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;
  subscribeToAssetTree: (query: SiteWiseAssetTreeQuery, callback: SiteWiseAssetTreeCallback) => AssetTreeSubscription;
}

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
  siteWiseTimeSeriesModule: IotAppKitDataModule;
  siteWiseAssetModule: SiteWiseAssetModule;
  attachDataModuleSession(session: DataModuleSession): void;
}

export interface Query<Callback> {
  build(session: AppKitComponentSession): Provider<Callback>;
}

export interface Provider<Callback> {
  subscribe(callback: Callback): void;
  unsubscribe(): void;
}
