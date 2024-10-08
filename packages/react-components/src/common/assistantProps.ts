import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export interface AssistantActionEventDetail {
  type: AssistantActionType;
  sourceComponentId: string;
  sourceComponentType?: string;
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
