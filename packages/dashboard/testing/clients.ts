import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';

import { getEnvCredentials } from './getEnvCredentials';
import { TEST_REGION } from './constants';

export const iotSiteWiseClient = new IoTSiteWiseClient({
  credentials: getEnvCredentials(),
  region: TEST_REGION,
});

export const iotEventsClient = new IoTEventsClient({
  credentials: getEnvCredentials(),
  region: TEST_REGION,
});
