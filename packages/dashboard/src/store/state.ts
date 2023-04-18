import type { DashboardWidgetsConfiguration, DashboardWidget } from '~/types';
import { deepFreeze } from '~/util/deepFreeze';

export type DashboardState = {
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
    stretchToFit: boolean;
  };
  readOnly: boolean;
  selectedWidgets: DashboardWidget[];
  copiedWidgets: DashboardWidget[];
  pasteCounter: number;
  dashboardConfiguration: DashboardWidgetsConfiguration;
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
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 20,
    stretchToFit: false,
  },
  readOnly: false,
  selectedWidgets: [],
  copiedWidgets: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
});
