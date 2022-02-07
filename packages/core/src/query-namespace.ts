import { QueryBuilder } from './interface';
import {
  AnyDataStreamQuery,
  DataModuleSubscription,
  SubscriptionUpdate,
  DataStreamCallback,
} from './data-module/types';
import { datamodule } from './module-namespace';
import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';

export namespace query.iotsitewise {
  export const timeSeriesData: QueryBuilder<
    DataModuleSubscription<AnyDataStreamQuery>,
    SubscriptionUpdate<AnyDataStreamQuery>,
    DataStreamCallback
  > = (subscription) => ({
    build: (session) => {
      return new SiteWiseTimeSeriesDataProvider(
        session,
        subscription,
        datamodule.iotsitewise.timeSeriesData(session),
        datamodule.iotsitewise.assetData(session)
      );
    },
  });
}
