import { DashboardConfiguration } from '../types';
import { isDefined } from '../util/isDefined';

/**
 * Returns a dashboard with the provided widget id's all with their z-index such that these widgets will display below all other widget on the dashboard.
 *
 * This method retains the relative z-index order of the widgets requested to bring to back.
 */
export const bringToBack = ({
  dashboardConfiguration,
  widgetIds,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgetIds: string[];
}): DashboardConfiguration => {
  const bottomZIndex = Math.min(...dashboardConfiguration.map(({ z }) => z));
  const maxSelectedZ = Math.max(
    ...widgetIds
      .map((widgetId) => dashboardConfiguration.find(({ id }) => id === widgetId))
      .filter(isDefined)
      .map(({ z }) => z)
  );

  const zOffset = bottomZIndex - 1 - maxSelectedZ;
  return dashboardConfiguration.map((widget) => {
    if (widgetIds.includes(widget.id)) {
      return {
        ...widget,
        z: widget.z + zOffset,
      };
    }
    return widget;
  });
};
