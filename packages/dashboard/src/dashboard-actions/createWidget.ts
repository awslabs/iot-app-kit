import { DashboardConfiguration, Widget } from '../types';
import { concatWidgets } from '../util/dashboardConfiguration';

export const createWidget = ({
  dashboardConfiguration,
  widgets,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgets: Widget[];
}): DashboardConfiguration => {
  return concatWidgets(dashboardConfiguration, widgets);
};
