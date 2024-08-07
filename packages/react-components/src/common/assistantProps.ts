import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export interface AssistantProperty {
  client: IoTSitewiseAssistantClient;
  conversationID: string;
  enabled?: boolean;
  onAction?: (event: { type: string; sourceComponentId: string }) => void;
}
