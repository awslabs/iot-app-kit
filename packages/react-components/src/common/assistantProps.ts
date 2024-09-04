import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { IMessage } from '../hooks/useAssistant/types';

export interface AssistantActionEventDetail {
  type: AssistantActionType;
  sourceComponentId: string;
  messages?: IMessage[];
}

export interface AssistantProperty {
  client: IoTSitewiseAssistantClient;
  conversationID: string;
  enabled?: boolean;
  iconPosition?: 'topLeft' | 'topRight';
  onAction?: (event: AssistantActionEventDetail) => void;
}

export type AssistantActionType = 'divedeep' | 'summarize';
