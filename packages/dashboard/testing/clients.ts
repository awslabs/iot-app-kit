import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';

import { getEnvCredentials } from './getEnvCredentials';

const REGION = 'us-west-2';

export const iotSiteWiseClient = new IoTSiteWiseClient({
  credentials: getEnvCredentials(),
  region: REGION,
});

export const iotEventsClient = new IoTEventsClient({
  credentials: getEnvCredentials(),
  region: REGION,
});
