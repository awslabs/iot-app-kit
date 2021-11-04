import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { accessKeyId, secretAccessKey, sessionToken } from '../../../../../creds.json';

export const sitewiseSdk = () =>
  new IoTSiteWiseClient({
    region: 'us-east-1',
    endpoint: 'https://iotsitewise.us-east-1.amazonaws.com/',
    credentials: { accessKeyId, secretAccessKey, sessionToken },
  });
