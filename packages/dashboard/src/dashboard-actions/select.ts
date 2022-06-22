import { Widgets, Rect } from '../types';
import { isContained } from '../util/isContained';

/**
 * Returns all widget id's of the widgets which intersect the given selection.
 *
 * This is utilized to determine what widgets are selected upon making a selection gesture.
 */
export const getSelectedWidgetIds = ({
  selectedRect,
  cellSize,
  dashboardConfiguration,
}: {
  selectedRect: Rect | undefined;
  cellSize: number;
  dashboardConfiguration: Widgets;
}) => {
  const isSelected = (rect: Rect): boolean =>
    selectedRect
      ? isContained(
          {
            x: (rect.x - 1) * cellSize,
            y: (rect.y - 1) * cellSize,
            width: rect.width * cellSize,
            height: rect.height * cellSize,
          },
          selectedRect
        )
      : false;
  return dashboardConfiguration.filter(isSelected).map(({ id }) => id);
};
