import { DashboardConfiguration, Widget } from '../types';
import { mapWidgets } from '../util/dashboardConfiguration';

/**
 * Returns a dashboard with the provided widget id's all with their z-index shifted by the offset.
 */
export const changeLayer = ({
  dashboardConfiguration,
  widgets,
  zOffset,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgets: Widget[];
  zOffset: number;
}): DashboardConfiguration => {
  const widgetIds = widgets.map((widget) => widget.id);
  return mapWidgets(dashboardConfiguration, (widget) => {
    if (widgetIds.includes(widget.id)) {
      return {
        ...widget,
        z: widget.z + zOffset,
      };
    }
    return widget;
  });
};
