import type { Rect, DashboardWidget } from '~/types';

// Returns the smallest rectangle which can contain all the selected widgets
export const getSelectionBox = (selectedWidgets: DashboardWidget[]): Rect | null => {
  if (selectedWidgets.length === 0) {
    return null;
  }

  const minX = Math.min(...selectedWidgets.map((widget) => widget.x));
  const maxX = Math.max(...selectedWidgets.map((widget) => widget.x + widget.width));
  const minY = Math.min(...selectedWidgets.map((widget) => widget.y));
  const maxY = Math.max(...selectedWidgets.map((widget) => widget.y + widget.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
