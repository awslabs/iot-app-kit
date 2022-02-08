import { IoTAppKitComponentSession } from './interface';
import { AnyDataStreamQuery, DataModuleSubscription } from './data-module/types';
import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';

/**
 * Extensible query namespace containing methods that allow end-users to build data providers
 * to supply to AppKit components.
 */
export namespace query.iotsitewise {
  export const timeSeriesData = (subscription: DataModuleSubscription<AnyDataStreamQuery>) => ({
    build: (session: IoTAppKitComponentSession) => {
      return new SiteWiseTimeSeriesDataProvider(session, subscription);
    },
  });
}
