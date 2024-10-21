import type { Anchor } from '~/store/dashboard/reducer';
import type { Position, Rect } from '~/types';

const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;
const rectWithinMin = (rect: Rect): Rect => {
  const { width, height } = rect;

  return {
    ...rect,
    width: Math.max(width, MIN_WIDTH),
    height: Math.max(height, MIN_HEIGHT),
  };
};
export const resizeSelectionBox: (params: {
  selectionBox: Rect;
  anchor: Anchor;
  vector: Position;
  grid: { height: number; width: number };
}) => Rect = ({
  selectionBox,
  anchor,
  vector,
  grid = {
    width: 100,
    height: 100,
  },
}) => {
  const newRect = { ...selectionBox };
  if (anchor.includes('top')) {
    if (newRect.y + vector.y < 0) {
      vector.y = 0 - newRect.y;
    }
    if (newRect.height - vector.y >= MIN_HEIGHT) {
      newRect.y += vector.y;
      newRect.height -= vector.y;
    }
  }
  if (anchor.includes('left')) {
    if (newRect.x + vector.x < 0) {
      vector.x = 0 - newRect.x;
    }
    // don't allow the selection box to be smaller than the minimum width
    if (newRect.width - vector.x >= MIN_WIDTH) {
      newRect.x += vector.x;
      newRect.width -= vector.x;
    }
  }
  if (anchor.includes('right')) {
    if (newRect.x + newRect.width + vector.x > grid.width) {
      vector.x = grid.width - newRect.x - newRect.width;
    }
    newRect.width += vector.x;
  }
  if (anchor.includes('bottom')) {
    if (newRect.y + newRect.height + vector.y > grid.height) {
      vector.y = grid.height - newRect.y - newRect.height;
    }
    newRect.height += vector.y;
  }

  return rectWithinMin(newRect);
};
