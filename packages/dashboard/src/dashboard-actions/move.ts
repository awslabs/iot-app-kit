import { DashboardConfiguration, Position } from '../types';

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
        x: widget.x + delta.x,
        y: widget.y + delta.y,
      };
    }
    return widget;
  });
};
