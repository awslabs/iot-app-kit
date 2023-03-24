import { Position, Rect } from '~/types';
import { DashboardState } from '~/store/state';

export const moveSelectionBox: (params: {
  selectionBox: Rect;
  vector: Position;
  grid: DashboardState['grid'];
}) => Rect = ({ selectionBox, vector, grid }) => {
  const newRect = { ...selectionBox };
  if (newRect.x + vector.x < 0) {
    vector.x = 0 - newRect.x;
  }

  if (newRect.x + newRect.width + vector.x > grid.width) {
    vector.x = grid.width - newRect.x - newRect.width;
  }

  if (newRect.y + vector.y < 0) {
    vector.y = 0 - newRect.y;
  }

  if (newRect.y + newRect.height + vector.y > grid.height) {
    vector.y = grid.height - newRect.y - newRect.height;
  }

  newRect.x += vector.x;
  newRect.y += vector.y;

  return newRect;
};
