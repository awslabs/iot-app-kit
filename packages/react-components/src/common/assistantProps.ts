import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { IMessage } from '../hooks/useAssistant/types';

export interface AssistantActionEventDetail {
  type: AssistantActionType;
  sourceComponentId: string;
  sourceComponentType?: string;
  messages?: IMessage[];
  selectedProperties?: number;
}

export interface AssistantProperty {
  client: IoTSitewiseAssistantClient;
  conversationId: string;
  componentId: string;
  target: AssistantActionTarget;
  enabled?: boolean;
  onAction?: (event: AssistantActionEventDetail) => void;
}

export type AssistantActionTarget = 'dashboard' | 'widget';
export type AssistantActionType =
  | 'divedeep'
  | 'summarize'
  | 'selection'
  | 'clear-selection';
export type AssistantWidgetTypes = 'kpi' | 'gauge' | 'table' | 'chart';
export type ComponentId = string;
