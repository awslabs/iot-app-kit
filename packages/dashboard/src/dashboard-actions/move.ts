import { DashboardConfiguration, Position } from '../types';

/**
 * Return dashboard configuration with the selected widgets moved based on a drag motion
 *
 * TODO: Refactor name to `move` for consistency
 */
export const getMovedDashboardConfiguration = ({
  position,
  previousPosition,
  selectedWidgetIds,
  dashboardConfiguration,
  cellSize,
}: {
  position: Position;
  previousPosition?: Position;
  selectedWidgetIds: string[];
  dashboardConfiguration: DashboardConfiguration;
  cellSize: number;
}) => {
  const { x, y } = position;

  const delta = {
    x: (x - (previousPosition ? previousPosition.x : 0)) / cellSize,
    y: (y - (previousPosition ? previousPosition.y : 0)) / cellSize,
  };
  return dashboardConfiguration.map((widget) => {
    if (selectedWidgetIds.includes(widget.id)) {
      return {
        ...widget,
        // widgets utilize css-grids to position, where x and y map to row and columns.
        // 1 represents the first row or column, so we ignore anything below that.
        x: Math.max(1, widget.x + delta.x),
        y: Math.max(1, widget.y + delta.y),
      };
    }
    return widget;
  });
};
