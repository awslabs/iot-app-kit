import type {
  AssistantStateTypes,
  DashboardTimeSeriesSettings,
  DashboardWidget,
} from '~/types';
import { v4 as uuid } from 'uuid';

export type DashboardState<
  Properties extends Record<string, unknown> = Record<string, unknown>
> = {
  isEdgeModeEnabled: boolean;
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
  };
  readOnly: boolean;
  selectedWidgetIds: readonly string[];
  copiedWidgetIds: readonly string[];
  pasteCounter: number;
  dashboardConfiguration: {
    widgets: DashboardWidget<Properties>[];
    querySettings?: DashboardTimeSeriesSettings;
    defaultViewport?: string;
  };
  significantDigits: number;
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
      widgetType: string;
      selectedProperties: number;
    }[];
  };
};

export const initialState: DashboardState = {
  isEdgeModeEnabled: false,
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 20,
  },
  readOnly: false,
  selectedWidgetIds: [],
  copiedWidgetIds: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    widgets: [],
    querySettings: {
      refreshRate: 5000,
    },
  },
  significantDigits: 4,
  assistant: {
    state: 'PASSIVE',
    conversationId: uuid(),
    isChatbotOpen: false,
    mode: 'off',
    selectedQueries: [],
  },
} satisfies DashboardState;
