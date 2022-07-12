import { DashboardConfiguration } from '../types';

export const deleteWidgets = ({
  dashboardConfiguration,
  widgetIdsToDelete,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetIdsToDelete: string[];
}) => {
  console.log('Dash config in delete', dashboardConfiguration);
  console.log('Widgets to delete ', widgetIdsToDelete);
  console.log(dashboardConfiguration.filter(({ id }) => !widgetIdsToDelete.includes(id)));
  return dashboardConfiguration.filter(({ id }) => !widgetIdsToDelete.includes(id));
};
