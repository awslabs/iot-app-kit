import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { IoTEvents } from '@aws-sdk/client-iot-events';

export const client = new IoTSiteWise({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
  region: 'us-east-1',
});

export const eventsClient = new IoTEvents({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
  region: 'us-east-1',
});
