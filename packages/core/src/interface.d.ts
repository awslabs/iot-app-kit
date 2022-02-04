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

export * from './components.d';
export * from './data-module/types.d';
export * from './data-sources';
export * from './index';
export * from './data-module/data-cache/requestTypes';
export * from './iotsitewise/time-series-data/types.d';

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
