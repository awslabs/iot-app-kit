import Dashboard from './components/dashboard';
import DashboardView from './components/dashboard/view';
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
