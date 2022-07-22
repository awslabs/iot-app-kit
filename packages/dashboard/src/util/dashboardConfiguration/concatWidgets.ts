import { DashboardConfiguration, Widget } from '../../types';

export const concatWidgets = (
  dashboardConfiguration: DashboardConfiguration,
  widgets: Widget[]
): DashboardConfiguration => ({
  ...dashboardConfiguration,
  widgets: [...dashboardConfiguration.widgets, ...widgets],
});
