import type { DashboardConfiguration } from '~/features/dashboard-configuration/dashboard-configuration';

// TODO: MOVE TO DASHBOARD PROPS
export type DashboardSave = (
  dashboardConfiguration: DashboardConfiguration,
  viewModeOnSave?: 'preview' | 'edit'
) => Promise<void>;
