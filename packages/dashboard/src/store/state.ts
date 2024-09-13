import type { DashboardTimeSeriesSettings, DashboardWidget } from '~/types';
import { deepFreeze } from '~/util/deepFreeze';

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
  selectedWidgets: DashboardWidget<Properties>[];
  copiedWidgets: DashboardWidget<Properties>[];
  pasteCounter: number;
  dashboardConfiguration: {
    widgets: DashboardWidget<Properties>[];
    querySettings?: DashboardTimeSeriesSettings;
    defaultViewport?: string;
  };
  significantDigits: number;
  timeZone?: string;
};

/**
 * default state for the dashboard to use.
 *
 * We want to prevent modification of this object
 * since it is exported as a singleton and will be
 * used to setup the initial dashboard state between
 * different instances of dashboard.
 *
 */
export const initialState: DashboardState = deepFreeze({
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
  significantDigits: 4,
});
