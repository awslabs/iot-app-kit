import type { DashboardViewProperties } from './components/dashboard/view';
import { DashboardViewWrapper as DashboardView } from './components/dashboard/viewOnlyWrapper';
import { DashboardWrapper as Dashboard } from './components/dashboard/wrapper';
import { migrateDashboard } from './migration/convert-monitor-to-app-defintion';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardProps,
  DashboardWidget,
} from './types';

export {
  Dashboard,
  DashboardClientConfiguration,
  DashboardConfiguration,
  DashboardDisplaySettings,
  // exported for backwards compatability
  DashboardProps as DashboardProperties,
  DashboardProps,
  DashboardView,
  DashboardViewProperties,
  DashboardWidget,
  migrateDashboard,
};
