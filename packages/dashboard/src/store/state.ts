import type { AssistantStateTypes } from '~/types';
import { v4 as uuid } from 'uuid';
import type { DashboardTimeSeriesSettings } from '~/features/dashboard-configuration/dashboard-configuration';
import type { WidgetInstance } from '~/features/widget-instance/instance';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface DashboardState {
  isEdgeModeEnabled: boolean;
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
  };
  readOnly: boolean;
  selectedWidgets: WidgetInstance[];
  copiedWidgets: WidgetInstance[];
  pasteCounter: number;
  dashboardConfiguration: {
    widgets: WidgetInstance[];
    querySettings?: DashboardTimeSeriesSettings;
    defaultViewport?: string;
  };
  decimalPlaces?: number | undefined;
  timeZone?: string;
  assistant: {
    state: AssistantStateTypes;
    conversationId: string;
    isChatbotOpen: boolean;
    callerComponentId?: string;
    action?: string;
    actionId?: string;
    mode: 'on' | 'off';
    selectedQueries: {
      widgetId: string;
      widgetType: RegisteredWidgetType;
      selectedProperties: number;
    }[];
  };
}

export const initialState = {
  isEdgeModeEnabled: false,
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 20,
  },
  readOnly: false,
  selectedWidgets: [],
  copiedWidgets: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    widgets: [],
    querySettings: {
      refreshRate: 5000,
    },
  },
  decimalPlaces: 4,
  assistant: {
    state: 'PASSIVE',
    conversationId: uuid(),
    isChatbotOpen: false,
    mode: 'off',
    selectedQueries: [],
  },
} satisfies DashboardState;
