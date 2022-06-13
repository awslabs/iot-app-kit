import DataLoader from 'dataloader';
import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { batchGetHistoricalPropertyDataPoints } from './batchGetHistoricalPropertyDataPoints';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { batchGetAggregatedPropertyDataPoints } from './batchGetAggregatedPropertyDataPoints';
import { batchGetLatestPropertyDataPoints } from './batchGetLatestPropertyDataPoints';

export type LatestPropertyParams = {
  requestInformations: RequestInformationAndRange[];
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
};

export type HistoricalPropertyParams = {
  requestInformations: RequestInformationAndRange[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
};

export type AggregatedPropertyParams = {
  requestInformations: RequestInformationAndRange[];
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
};

export class SiteWiseClient {
  private siteWiseSdk: IoTSiteWiseClient;

  private latestPropertyDataLoader: DataLoader<LatestPropertyParams, void>;
  private historicalPropertyDataLoader: DataLoader<HistoricalPropertyParams, void>;
  private aggregatedPropertyDataLoader: DataLoader<AggregatedPropertyParams, void>;

  constructor(siteWiseSdk: IoTSiteWiseClient) {
    this.siteWiseSdk = siteWiseSdk;
    this.instantiateDataLoaders();
  }

  /**
   * Instantiate batch data loaders for latest, historical, and aggregated data.
   * by default, data loaders will schedule batches for each frame of execution which ensures
   * no additional latency when capturing many related requests in a single batch.
   *
   * @todo: adjust batch frequency for optimal sitewise request batching (latency vs. #requests)
   * @todo: switch out existing APIs for batch APIs
   */
  private instantiateDataLoaders() {
    this.latestPropertyDataLoader = new DataLoader<LatestPropertyParams, void>(async (keys) => {
      batchGetLatestPropertyDataPoints({ params: keys.flat(), client: this.siteWiseSdk });
      return keys.map(() => undefined); // values are updated in data cache and don't need to be rebroadcast
    });

    this.historicalPropertyDataLoader = new DataLoader<HistoricalPropertyParams, void>(async (keys) => {
      batchGetHistoricalPropertyDataPoints({ params: keys.flat(), client: this.siteWiseSdk });
      return keys.map(() => undefined);
    });

    this.aggregatedPropertyDataLoader = new DataLoader<AggregatedPropertyParams, void>(async (keys) => {
      batchGetAggregatedPropertyDataPoints({ params: keys.flat(), client: this.siteWiseSdk });
      return keys.map(() => undefined);
    });
  }

  getLatestPropertyDataPoint(params: LatestPropertyParams): Promise<void> {
    return this.latestPropertyDataLoader.load(params);
  }

  getHistoricalPropertyDataPoints(params: HistoricalPropertyParams): Promise<void> {
    return this.historicalPropertyDataLoader.load(params);
  }

  getAggregatedPropertyDataPoints(params: AggregatedPropertyParams): Promise<void> {
    return this.aggregatedPropertyDataLoader.load(params);
  }
}
