import type { DashboardConfiguration } from './dashboard-configuration';

export type DashboardSave = (
  dashboardConfiguration: DashboardConfiguration,
  viewModeOnSave?: 'preview' | 'edit'
) => Promise<void>;
