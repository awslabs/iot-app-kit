import { DashboardConfiguration, Widget } from '../../types';

export const mapWidgets = (
  dashboardConfiguration: DashboardConfiguration,
  func: (widget: Widget) => Widget
): DashboardConfiguration => ({
  ...dashboardConfiguration,
  widgets: dashboardConfiguration.widgets.map(func),
});
