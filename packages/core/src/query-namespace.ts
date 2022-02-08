import { IoTAppKitComponentSession, TimeSeriesDataRequestSettings, TimeSeriesQuery } from './interface';
import { AnyDataStreamQuery, DataModuleSubscription } from './data-module/types';
import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';

/**
 * Extensible query namespace containing methods that allow end-users to build data providers
 * to supply to AppKit components.
 */
export namespace query.iotsitewise {
  export const timeSeriesData = (
    input: DataModuleSubscription<AnyDataStreamQuery>
  ): TimeSeriesQuery<SiteWiseTimeSeriesDataProvider> => ({
    build: (session: IoTAppKitComponentSession, defaults?: TimeSeriesDataRequestSettings) =>
      new SiteWiseTimeSeriesDataProvider(session, {
        ...input,
        request: {
          ...input.request,
          settings: {
            ...(defaults || {}),
            ...input.request.settings,
          },
        },
      }),
  });
}
