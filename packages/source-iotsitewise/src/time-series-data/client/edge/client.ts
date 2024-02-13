import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { getAggregatedPropertyDataPoints } from './getAggregatedPropertyDataPoints';
import { getHistoricalPropertyDataPoints } from './getHistoricalPropertyDataPoints';
import { getLatestPropertyDataPoint } from './getLatestPropertyDataPoint';
import {
  AggregatedPropertyParams,
  HistoricalPropertyParams,
  LatestPropertyParams,
} from '../client';

export class SiteWiseClientEdge {
  private siteWiseSdk: IoTSiteWiseClient;

  constructor(siteWiseSdk: IoTSiteWiseClient) {
    this.siteWiseSdk = siteWiseSdk;
  }

  getLatestPropertyDataPoint(params: LatestPropertyParams): Promise<void> {
    return getLatestPropertyDataPoint({
      client: this.siteWiseSdk,
      ...params,
    });
  }

  getHistoricalPropertyDataPoints(
    params: HistoricalPropertyParams
  ): Promise<void> {
    return getHistoricalPropertyDataPoints({
      client: this.siteWiseSdk,
      ...params,
    });
  }

  getAggregatedPropertyDataPoints(
    params: AggregatedPropertyParams
  ): Promise<void> {
    return getAggregatedPropertyDataPoints({
      client: this.siteWiseSdk,
      ...params,
    });
  }
}
