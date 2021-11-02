import { IoTSiteWiseClient, GetAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { toDataPoint } from './util/toDataPoint';

export class SiteWiseClient {
  private siteWiseSdk: IoTSiteWiseClient;

  constructor(siteWiseSdk: IoTSiteWiseClient) {
    this.siteWiseSdk = siteWiseSdk;
  }

  async getLatestPropertyDataPoint({ assetId, propertyId }: { assetId: string; propertyId: string }) {
    const response = await this.siteWiseSdk.send(new GetAssetPropertyValueCommand({ assetId, propertyId }));
    return toDataPoint(response.propertyValue);
  }
}
