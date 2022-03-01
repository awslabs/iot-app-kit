import { IoTSiteWiseClient, AggregateType } from '@aws-sdk/client-iotsitewise';
import { getLatestPropertyDataPoint } from './getLatestPropertyDataPoint';
import { getHistoricalPropertyDataPoints } from './getHistoricalPropertyDataPoints';
import { getAggregatedPropertyDataPoints } from './getAggregatedPropertyDataPoints';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';

export class SiteWiseClient {
  private siteWiseSdk: IoTSiteWiseClient;

  constructor(siteWiseSdk: IoTSiteWiseClient) {
    this.siteWiseSdk = siteWiseSdk;
  }

  getLatestPropertyDataPoint(options: {
    requestInformations: RequestInformationAndRange[];
    onSuccess: OnSuccessCallback;
    onError: ErrorCallback;
  }): Promise<void> {
    return getLatestPropertyDataPoint({ client: this.siteWiseSdk, ...options });
  }

  async getHistoricalPropertyDataPoints(options: {
    requestInformations: RequestInformationAndRange[];
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: OnSuccessCallback;
  }): Promise<void> {
    return getHistoricalPropertyDataPoints({ client: this.siteWiseSdk, ...options });
  }

  async getMostRecentPropertyDataPointBeforeDate(options: {
    requestInformations: RequestInformationAndRange[];
    date: Date;
    onError: ErrorCallback;
    onSuccess: OnSuccessCallback;
  }): Promise<void> {
    const requestInformations = options.requestInformations.map((info) => ({
      ...info,
      start: new Date(0, 0, 0),
      end: options.date,
    }));
    return getHistoricalPropertyDataPoints({ client: this.siteWiseSdk, ...options, requestInformations });
  }

  async getAggregatedPropertyDataPoints(options: {
    requestInformations: RequestInformationAndRange[];
    aggregateTypes: AggregateType[];
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: OnSuccessCallback;
  }): Promise<void> {
    return getAggregatedPropertyDataPoints({ client: this.siteWiseSdk, ...options });
  }
}
