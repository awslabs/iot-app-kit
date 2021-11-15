import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '../types';
import { getLatestPropertyDataPoint } from './getLatestPropertyDataPoint';
import { getHistoricalPropertyDataPoints } from './getHistoricalPropertyDataPoints';
import { DataStreamCallback, ErrorCallback } from '../../../data-module/types.d';

export class SiteWiseClient {
  private siteWiseSdk: IoTSiteWiseClient;

  constructor(siteWiseSdk: IoTSiteWiseClient) {
    this.siteWiseSdk = siteWiseSdk;
  }

  getLatestPropertyDataPoint(options: {
    query: SiteWiseDataStreamQuery;
    onSuccess: DataStreamCallback;
    onError: ErrorCallback;
  }): Promise<void> {
    return getLatestPropertyDataPoint({ client: this.siteWiseSdk, ...options });
  }

  async getHistoricalPropertyDataPoints(options: {
    query: SiteWiseDataStreamQuery;
    start: Date;
    end: Date;
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: DataStreamCallback;
  }): Promise<void> {
    return getHistoricalPropertyDataPoints({ client: this.siteWiseSdk, ...options });
  }
}
