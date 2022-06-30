import { DashboardConfiguration } from '../types';

export const deleteWidgets = ({
  dashboardConfiguration,
  widgetIdsToDelete,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetIdsToDelete: string[];
}) => dashboardConfiguration.filter(({ id }) => !widgetIdsToDelete.includes(id));