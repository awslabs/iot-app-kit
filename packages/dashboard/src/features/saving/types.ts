import type { DashboardConfiguration } from '#types';

// OnSave has an optional viewMode value which can be used to persist the dashboard's viewMode after the save action
export type DashboardSave = (
  dashboardConfiguration: DashboardConfiguration,
  viewModeOnSave?: 'preview' | 'edit'
) => Promise<void>;
