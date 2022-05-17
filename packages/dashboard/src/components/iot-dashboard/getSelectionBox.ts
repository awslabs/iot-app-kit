import { DashboardConfiguration, Rect } from '../../types';
import { isDefined } from '../../util/isDefined';

// Returns the smallest rectangle which can contain all the selected widgets
export const getSelectionBox = ({
  selectedWidgetIds,
  dashboardConfiguration,
}: {
  selectedWidgetIds: string[];
  dashboardConfiguration: DashboardConfiguration;
}): Rect | null => {
  const widgets = selectedWidgetIds
    .map((widgetId) => dashboardConfiguration.find((widget) => widget.id === widgetId))
    .filter(isDefined);

  if (widgets.length === 0) {
    return null;
  }

  const minX = Math.min(...widgets.map((widget) => widget.x));
  const maxX = Math.max(...widgets.map((widget) => widget.x + widget.width));
  const minY = Math.min(...widgets.map((widget) => widget.y));
  const maxY = Math.max(...widgets.map((widget) => widget.y + widget.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
