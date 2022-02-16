import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';
import { IoTAppKitComponentSession, TimeSeriesDataRequest, TimeSeriesQuery, SiteWiseAssetQuery } from './index';

/**
 * Extensible query namespace exposing methods that return Query<Provider> implementations
 */
export namespace query.iotsitewise {
  export const timeSeriesData = (assetQuery: SiteWiseAssetQuery): TimeSeriesQuery<SiteWiseTimeSeriesDataProvider> => ({
    build: (session: IoTAppKitComponentSession, params: TimeSeriesDataRequest) =>
      new SiteWiseTimeSeriesDataProvider(session, {
        queries: [
          {
            source: 'site-wise',
            ...assetQuery,
          },
        ],
        request: params,
      }),
  });
}
