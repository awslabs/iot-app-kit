import type { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

export interface WithClient {
  client: IoTTwinMakerClient;
}
