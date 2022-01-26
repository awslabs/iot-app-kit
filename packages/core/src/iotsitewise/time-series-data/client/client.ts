import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '../types';
import { getLatestPropertyDataPoint } from './getLatestPropertyDataPoint';
import { getHistoricalPropertyDataPoints } from './getHistoricalPropertyDataPoints';
import { getAggregatedPropertyDataPoints } from './getAggregatedPropertyDataPoints';
import { DataStreamCallback, ErrorCallback } from '../../../data-module/types';

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

  async getAggregatedPropertyDataPoints(options: {
    query: SiteWiseDataStreamQuery;
    start: Date;
    end: Date;
    resolution?: string;
    aggregateTypes: AggregateType[];
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: DataStreamCallback;
  }): Promise<void> {
    return getAggregatedPropertyDataPoints({ client: this.siteWiseSdk, ...options });
  }
}
