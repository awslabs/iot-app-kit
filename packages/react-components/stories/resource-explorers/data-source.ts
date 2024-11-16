import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { IoTEvents } from '@aws-sdk/client-iot-events';

export const client = new IoTSiteWise({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  region: 'us-west-2',
});

export const eventsClient = new IoTEvents({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  region: 'us-west-2',
});
