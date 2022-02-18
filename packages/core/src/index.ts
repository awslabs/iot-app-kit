import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise/dist-types/IoTSiteWiseClient';
import { Credentials } from '@aws-sdk/types';
import { Provider as AWSCredentialsProvider } from '@aws-sdk/types/dist-types/util';
import { DataSource, DataStreamQuery } from './data-module/types';
import { AssetTreeSubscription, SiteWiseAssetTreeObserver, SiteWiseAssetTreeQuery } from './asset-modules';
import { TimeSeriesDataRequest } from './data-module/data-cache/requestTypes';

export * from './data-module/data-cache/requestTypes';
export * from './data-module/index';
export * from './asset-modules/index';
export * from './iotAppKit';
export * from './module-namespace';
export * from './query-namespace';
export * from './iotsitewise/time-series-data/provider';
export * from './testing'; // @todo: build as a separate bundle
export * from './data-module/types';
export * from './iotsitewise/time-series-data/types';
export * from './common/types';

export type IoTAppKitInitInputs =
  | {
      registerDataSources?: boolean;
      iotSiteWiseClient: IoTSiteWiseClient;
    }
  | {
      registerDataSources?: boolean;
      awsCredentials: Credentials | AWSCredentialsProvider<Credentials>;
      awsRegion: string;
    };

export interface IoTAppKit {
  session: (componentId: string) => IoTAppKitComponentSession;
  registerTimeSeriesDataSource: <Query extends DataStreamQuery>(dataSource: DataSource<Query>) => void;
  /** @todo: create asset provider */
  subscribeToAssetTree: (query: SiteWiseAssetTreeQuery, observer: SiteWiseAssetTreeObserver) => AssetTreeSubscription;
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

export interface TimeSeriesQuery<Provider> extends Query<Provider, TimeSeriesDataRequest> {}

export interface Provider<DataType> {
  subscribe(callback: (data: DataType) => void): void;
  unsubscribe(): void;
}
