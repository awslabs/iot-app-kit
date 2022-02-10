import { IoTAppKitComponentSession, TimeSeriesDataRequestSettings, TimeSeriesQuery } from './interface';
import { AnyDataStreamQuery, DataModuleSubscription } from './data-module/types';
import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';

/**
 * Extensible query namespace exposing methods that return Query<Provider> implementations
 */
export namespace query.iotsitewise {
  export const timeSeriesData = (
    input: DataModuleSubscription<AnyDataStreamQuery>
  ): TimeSeriesQuery<SiteWiseTimeSeriesDataProvider> => ({
    build: (session: IoTAppKitComponentSession, params?: TimeSeriesDataRequestSettings) =>
      new SiteWiseTimeSeriesDataProvider(session, {
        ...input,
        request: {
          ...input.request,
          settings: {
            ...(params || {}),
            ...input.request.settings,
          },
        },
      }),
  });
}
