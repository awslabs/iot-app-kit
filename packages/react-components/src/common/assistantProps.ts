import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export interface AssistantActionEventDetail { 
  type: AssistantActionType; 
  sourceComponentId: string 
}

export interface AssistantProperty {
  client: IoTSitewiseAssistantClient;
  conversationID: string;
  enabled?: boolean;
  onAction?: (event: AssistantActionEventDetail) => void;
}

export type AssistantActionType = 'divedeep' | 'summary';