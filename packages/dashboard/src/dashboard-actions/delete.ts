import { DashboardConfiguration } from '../types';

/**
 * Returns dashboard with the selected widgets deleted
 */
export const deleteWidgets = ({
  dashboardConfiguration,
  widgetIdsToDelete,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetIdsToDelete: string[];
}) => dashboardConfiguration.filter(({ id }) => !widgetIdsToDelete.includes(id));
