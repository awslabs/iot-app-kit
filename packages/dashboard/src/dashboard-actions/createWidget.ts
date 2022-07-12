import { concat } from 'lodash';
import { CreateAction, DashboardConfiguration, Widget } from '../types';

export const createWidget = ({
  dashboardConfiguration,
  widgets,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgets: Widget[];
}): DashboardConfiguration => {
  return concat(dashboardConfiguration, widgets);
};
