import { DashboardWrapper as Dashboard } from './components/dashboard/wrapper';
import { DashboardViewWrapper as DashboardView } from './components/dashboard/viewOnlyWrapper';
import type { DashboardProperties } from './components/dashboard';
import type { DashboardViewProperties } from './components/dashboard/view';
import { migrateDashboard } from './migration/convert-monitor-to-app-defintion';

import type { WidgetInstance } from '~/features/widget-instance/instance';

export type { DashboardClientConfiguration } from '~/features/queries/sdk-clients';
export type {
  DashboardConfiguration,
  DashboardDisplaySettings,
} from '~/features/dashboard-configuration/dashboard-configuration';

// backwards-compatible type
export type DashboardWidget = WidgetInstance;

export {
  Dashboard,
  DashboardProperties,
  DashboardView,
  DashboardViewProperties,
  WidgetInstance,
  migrateDashboard,
};
