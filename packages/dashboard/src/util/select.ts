import last from 'lodash-es/last';
import sortBy from 'lodash-es/sortBy';
import type { DashboardWidget, 2DPosition, Rectangle, Selection } from '../types';
import { overlaps } from '../grid/rectangle/intersects';

export const getSelectedWidgets = ({
  selectedRect,
  cellSize,
  dashboardWidgets,
}: {
  selectedRect: Rectangle | undefined;
  cellSize: number;
  dashboardWidgets: DashboardWidget[];
}) => {
  const isSelected = (rect: Rectangle): boolean =>
    selectedRect
      ? overlaps(
          {
            x: rect.x * cellSize,
            y: rect.y * cellSize,
            width: rect.width * cellSize,
            height: rect.height * cellSize,
          },
          selectedRect
        )
      : false;
  return dashboardWidgets.filter(isSelected);
};

/**
 * Returns all widget id's of the widgets which intersect the given selection.
 *
 * This is utilized to determine what widgets are selected upon making a selection gesture.
 */
export const getSelectedWidgetIds = ({
  selectedRect,
  cellSize,
  dashboardWidgets,
}: {
  selectedRect: Rectangle | undefined;
  cellSize: number;
  dashboardWidgets: DashboardWidget[];
}) =>
  getSelectedWidgets({ selectedRect, cellSize, dashboardWidgets }).map(
    (widget) => widget.id
  );

/**
 *
 * return the first widget that intersects a position
 */
export const pointSelect = ({
  position,
  cellSize,
  dashboardWidgets,
}: {
  position: 2DPosition;
  cellSize: number;
  dashboardWidgets: DashboardWidget[];
}): DashboardWidget | undefined => {
  /**
   * TODO edge case where bottom most pixel on a widget does not pick up the intersection
   * and the top most pixel above a widget picks up the intersection
   */
  const { x, y } = position;
  const intersectedWidgets = getSelectedWidgets({
    selectedRect: { x, y, width: 1, height: 1 },
    dashboardWidgets,
    cellSize: cellSize,
  });

  const sortableWidgets = intersectedWidgets.map((widget, index) => ({
    id: widget.id,
    z: widget.z,
    index,
  }));
  const topMostWidgetId = last(
    sortBy(sortableWidgets, ['z', 'index']).map((widget) => widget.id)
  );
  return dashboardWidgets.find((widget) => widget.id === topMostWidgetId);
};

export const selectedRect = (
  selection: Selection | undefined
): Rectangle | undefined => {
  if (!selection) {
    return undefined;
  }
  return {
    x: Math.min(selection.start.x, selection.end.x),
    y: Math.min(selection.start.y, selection.end.y),
    width: Math.abs(selection.start.x - selection.end.x),
    height: Math.abs(selection.start.y - selection.end.y),
  };
};
