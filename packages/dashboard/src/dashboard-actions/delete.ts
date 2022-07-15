import { DashboardConfiguration } from '../types';
import { filterWidgets } from '../util/dashboardConfiguration';

/**
 * Returns dashboard with the selected widgets deleted
 */
export const deleteWidgets = ({
  dashboardConfiguration,
  widgetIdsToDelete,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetIdsToDelete: string[];
}) => filterWidgets(dashboardConfiguration, ({ id }) => !widgetIdsToDelete.includes(id));
