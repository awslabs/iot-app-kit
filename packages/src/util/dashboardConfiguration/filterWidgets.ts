import { DashboardConfiguration, Widget } from '../../types';

export const filterWidgets = (
  dashboardConfiguration: DashboardConfiguration,
  func: (widget: Widget) => boolean
): DashboardConfiguration => ({
  ...dashboardConfiguration,
  widgets: dashboardConfiguration.widgets.filter(func),
});
