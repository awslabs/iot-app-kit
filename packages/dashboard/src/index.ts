import type { DashboardProperties } from './dashboard';
import type { DashboardViewProperties } from './dashboard/view';
import { DashboardViewWrapper as DashboardView } from './dashboard/viewOnlyWrapper';
import { DashboardWrapper as Dashboard } from './dashboard/wrapper';
import { migrateDashboard } from './migration/convert-monitor-to-app-defintion';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardWidget,
} from './types/public';

export {
  Dashboard,
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardProperties,
  DashboardView,
  DashboardViewProperties,
  DashboardWidget,
  migrateDashboard,
};
