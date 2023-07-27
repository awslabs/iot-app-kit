import type { IoTEventsClient } from '@aws-sdk/client-iot-events';

export interface WithClient {
  client: IoTEventsClient;
}
