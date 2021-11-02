import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export const sitewiseSdk = () =>
  new IoTSiteWiseClient({
    region: 'us-east-1',
    endpoint: 'https://data.iotsitewise.us-east-1.amazonaws.com',
  });
