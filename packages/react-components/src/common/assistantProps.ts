import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export interface AssistantActionEventDetail {
  type: AssistantActionType;
  sourceComponentId: string;
}

export interface AssistantProperty {
  client: IoTSitewiseAssistantClient;
  conversationID: string;
  enabled?: boolean;
  iconPosition?: 'topLeft' | 'topRight';
  onAction?: (event: AssistantActionEventDetail) => void;
}

export type AssistantActionType = 'divedeep' | 'summarize';
