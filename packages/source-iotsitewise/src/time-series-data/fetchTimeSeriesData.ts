import { TimeSeriesDataModule, Viewport, DataStream } from '@iot-app-kit/core';
import { SiteWiseDataStreamQuery } from './types';
import { TimeSeriesDataStore } from './store';
import { completeDataStreams } from '../completeDataStreams';

// creates async function which requests cachedDataStreams until all the data for viewport is present
export const fetchTimeSeriesData =
  (
    siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>,
    store: TimeSeriesDataStore
  ) =>
  async ({
    query,
    viewport,
  }: {
    query: SiteWiseDataStreamQuery;
    viewport: Viewport;
  }): Promise<DataStream[]> => {
    return new Promise((resolve) => {
      siteWiseTimeSeriesModule.getCachedDataStreams({
        queries: [query],
        viewport,
        emitDataStreams: (ds: DataStream[]) =>
          resolve(
            completeDataStreams({
              modeledDataStreams: store.modeledDataStreams,
              dataStreams: ds,
              assetModels: store.assetModels,
              alarms: store.alarms,
            })
          ),
      });
    });
  };
