import { IoTAppKitComponentSession, TimeSeriesDataRequest, TimeSeriesQuery } from './interface';
import { AnyDataStreamQuery } from './data-module/types';
import { SiteWiseTimeSeriesDataProvider } from './iotsitewise/time-series-data/provider';

/**
 * Extensible query namespace exposing methods that return Query<Provider> implementations
 */
export namespace query.iotsitewise {
  export const timeSeriesData = (
    assetQueries: AnyDataStreamQuery /* @todo: better query types */
  ): TimeSeriesQuery<SiteWiseTimeSeriesDataProvider> => ({
    build: (session: IoTAppKitComponentSession, params: TimeSeriesDataRequest) =>
      new SiteWiseTimeSeriesDataProvider(session, {
        queries: [
          {
            source: 'site-wise',
            assets: assetQueries,
          },
        ],
        request: params,
      }),
  });
}
