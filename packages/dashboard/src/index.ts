import { DashboardWrapper as Dashboard } from './components/dashboard/wrapper';
import { DashboardViewWrapper as DashboardView } from './components/dashboard/viewOnlyWrapper';
import type { DashboardProperties } from './components/dashboard';
import type { DashboardViewProperties } from './components/dashboard/view';
import type {
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardClientConfiguration,
  DashboardWidget,
} from './types';
import { migrateDashboard } from './migration/convert-monitor-to-app-defintion';

export {
  Dashboard,
  DashboardProperties,
  DashboardView,
  DashboardViewProperties,
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardClientConfiguration,
  DashboardWidget,
  migrateDashboard,
};
