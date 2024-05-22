import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

export const client = new IoTSiteWise({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  region: '',
});
