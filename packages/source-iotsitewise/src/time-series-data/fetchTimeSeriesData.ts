import {
  type TimeSeriesDataModule,
  type Viewport,
  type DataStream,
  type TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { type SiteWiseDataStreamQuery } from './types';

// creates async function which requests cachedDataStreams until all the data for viewport is present
export const fetchTimeSeriesData =
  (siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>) =>
  async ({
    query,
    viewport,
    settings,
  }: {
    query: SiteWiseDataStreamQuery;
    viewport: Viewport;
    settings?: TimeSeriesDataRequestSettings;
  }): Promise<DataStream[]> => {
    return new Promise((resolve) => {
      siteWiseTimeSeriesModule.getCachedDataStreams({
        queries: [query],
        viewport,
        settings,
        emitDataStreams: (ds: DataStream[]) => resolve(ds),
      });
    });
  };
