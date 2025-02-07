import DataLoader from 'dataloader';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { batchGetHistoricalPropertyDataPoints } from './batchGetHistoricalPropertyDataPoints';
import { batchGetAggregatedPropertyDataPoints } from './batchGetAggregatedPropertyDataPoints';
import { batchGetLatestPropertyDataPoints } from './batchGetLatestPropertyDataPoints';
import type {
  ErrorCallback,
  OnSuccessCallback,
  RequestInformationAndRange,
} from '@iot-app-kit/core';
import type { SiteWiseDataSourceSettings } from '../types';

export interface LatestPropertyParams {
  requestInformations: RequestInformationAndRange[];
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
}

export interface HistoricalPropertyParams {
  requestInformations: RequestInformationAndRange[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
}

export interface AggregatedPropertyParams {
  requestInformations: RequestInformationAndRange[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
}

export interface SiteWiseClientSettings {
  batchDuration?: SiteWiseDataSourceSettings['batchDuration'];
}

export class SiteWiseClient {
  private siteWiseSdk: IoTSiteWiseClient;
  private settings: SiteWiseDataSourceSettings;

  private latestPropertyDataLoader: DataLoader<LatestPropertyParams, void>;
  private historicalPropertyDataLoader: DataLoader<
    HistoricalPropertyParams,
    void
  >;
  private aggregatedPropertyDataLoader: DataLoader<
    AggregatedPropertyParams,
    void
  >;

  constructor(
    siteWiseSdk: IoTSiteWiseClient,
    settings: SiteWiseClientSettings = {}
  ) {
    this.siteWiseSdk = siteWiseSdk;
    this.settings = settings;

    /**
     * Instantiate batch data loaders for latest, historical, and aggregated data.
     * by default, data loaders will schedule batches for each frame of execution which ensures
     * no additional latency when capturing many related requests in a single batch.
     */
    this.latestPropertyDataLoader = new DataLoader<LatestPropertyParams, void>(
      async (keys) => {
        batchGetLatestPropertyDataPoints({
          params: keys.flat(),
          client: this.siteWiseSdk,
        });
        return keys.map(() => undefined); // values are updated in data cache and don't need to be rebroadcast
      },
      {
        batchScheduleFn: this.settings.batchDuration
          ? (callback) => setTimeout(callback, this.settings.batchDuration)
          : undefined,
      }
    );

    this.historicalPropertyDataLoader = new DataLoader<
      HistoricalPropertyParams,
      void
    >(
      async (keys) => {
        batchGetHistoricalPropertyDataPoints({
          params: keys.flat(),
          client: this.siteWiseSdk,
        });
        return keys.map(() => undefined);
      },
      {
        batchScheduleFn: this.settings.batchDuration
          ? (callback) => setTimeout(callback, this.settings.batchDuration)
          : undefined,
      }
    );

    this.aggregatedPropertyDataLoader = new DataLoader<
      AggregatedPropertyParams,
      void
    >(
      async (keys) => {
        batchGetAggregatedPropertyDataPoints({
          params: keys.flat(),
          client: this.siteWiseSdk,
        });
        return keys.map(() => undefined);
      },
      {
        batchScheduleFn: this.settings.batchDuration
          ? (callback) => setTimeout(callback, this.settings.batchDuration)
          : undefined,
      }
    );
  }

  getLatestPropertyDataPoint(params: LatestPropertyParams): Promise<void> {
    return this.latestPropertyDataLoader.load(params);
  }

  getHistoricalPropertyDataPoints(
    params: HistoricalPropertyParams
  ): Promise<void> {
    return this.historicalPropertyDataLoader.load(params);
  }

  getAggregatedPropertyDataPoints(
    params: AggregatedPropertyParams
  ): Promise<void> {
    return this.aggregatedPropertyDataLoader.load(params);
  }
}
