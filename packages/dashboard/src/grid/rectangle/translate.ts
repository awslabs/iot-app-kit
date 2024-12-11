import type { CellLength } from '#grid/cell/types';
import { placeWithinRectangle } from '#grid/rectangle/nest';
import type { Rectangle } from '#grid/rectangle/types';
import { type DashboardState } from '../../store/state-old';
import {
  type Position as OldPosition,
  type Rectangle as OldRectangle,
} from '../../types';

export const moveSelectionBox: (params: {
  // { x: 200, y: ?; width: 300; height: ? }
  selectionBox: OldRectangle;
  // { x: 400, y: ? }
  vector: OldPosition;
  // { width: 700; height: ? }
  grid: DashboardState['grid'];
}) => OldRectangle = ({ selectionBox, vector, grid }) => {
  // { x: 200, y: ?; width: 300; height: ? }
  const newRect = { ...selectionBox };

  // 200 + 400 < 0
  // 600 < 0
  // false
  if (newRect.x + vector.x < 0) {
    vector.x = 0 - newRect.x;
  }

  // 200 + 300 + 400 > 700
  // 900 > 700
  // true
  if (newRect.x + newRect.width + vector.x > grid.width) {
    // = 700 - 200 - 300
    // = 200
    vector.x = grid.width - newRect.x - newRect.width;
  }

  if (newRect.y + vector.y < 0) {
    vector.y = 0 - newRect.y;
  }

  if (newRect.y + newRect.height + vector.y > grid.height) {
    vector.y = grid.height - newRect.y - newRect.height;
  }

  // = 200 + 200
  // = 400
  newRect.x += vector.x;
  newRect.y += vector.y;

  return newRect;
};

export function translate(
  { x, y, ...rectangle }: Rectangle,
  offset: { x: CellLength; y: CellLength }
): Rectangle {
  return {
    ...rectangle,
    x: x + offset.x,
    y: y + offset.y,
  };
}

export function translateWithin(
  rectangle: Rectangle,
  offset: { x: CellLength; y: CellLength },
  container: Rectangle
): Rectangle {
  return placeWithinRectangle(translate(rectangle, offset), container);
}
