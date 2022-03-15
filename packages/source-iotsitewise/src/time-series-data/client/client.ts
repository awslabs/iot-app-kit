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

  getHistoricalPropertyDataPoints(options: {
    requestInformations: RequestInformationAndRange[];
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: OnSuccessCallback;
  }): Promise<void> {
    return getHistoricalPropertyDataPoints({
      client: this.siteWiseSdk,
      ...options,
    });
  }

  getAggregatedPropertyDataPoints(options: {
    requestInformations: RequestInformationAndRange[];
    aggregateTypes: AggregateType[];
    maxResults?: number;
    onError: ErrorCallback;
    onSuccess: OnSuccessCallback;
  }): Promise<void> {
    return getAggregatedPropertyDataPoints({
      client: this.siteWiseSdk,
      ...options,
    });
  }
}
