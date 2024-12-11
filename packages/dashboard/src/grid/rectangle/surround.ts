import type { DashboardWidget, Rectangle as OldRectangle } from '../../types';
import type { Rectangle } from '#grid/rectangle/types';

// Returns the smallest rectangle which can contain all the selected widgets
export const getSelectionBox = (
  selectedWidgets: DashboardWidget[]
): OldRectangle | null => {
  if (selectedWidgets.length === 0) {
    return null;
  }

  const minX = Math.min(...selectedWidgets.map((widget) => widget.x));
  const maxX = Math.max(
    ...selectedWidgets.map((widget) => widget.x + widget.width)
  );
  const minY = Math.min(...selectedWidgets.map((widget) => widget.y));
  const maxY = Math.max(
    ...selectedWidgets.map((widget) => widget.y + widget.height)
  );

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/** Create the smallest rectangle containing a group of rectangles. */
export function surround(rectangles: Rectangle[]): Rectangle | null {
  if (rectangles.length === 0) return null;

  const { x1, y1, x2, y2 } = rectangles.reduce(
    ({ x1, y1, x2, y2 }, { x, y, height, width }) => {
      return {
        x1: Math.min(x1, x),
        y1: Math.min(y1, y),
        x2: Math.max(x2, x + width),
        y2: Math.max(y2, y + height),
      };
    },
    { x1: 0, y1: 0, x2: 0, y2: 0 }
  );

  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}
