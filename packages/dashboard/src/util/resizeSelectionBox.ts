import type { Position, Rect } from '~/types';
import type { Anchor } from '~/store/actions';

const MIN_WIDTH = 2;
const MIN_HEIGHT = 2;
const rectWithinMin = (rect: Rect): Rect => {
  const { width, height } = rect;

  return {
    ...rect,
    width: Math.max(width, MIN_WIDTH),
    height: Math.max(height, MIN_HEIGHT),
  };
};
export const resizeSelectionBox: (params: { selectionBox: Rect; anchor: Anchor; vector: Position }) => Rect = ({
  selectionBox,
  anchor,
  vector,
}) => {
  const newRect = { ...selectionBox };
  if (anchor.includes('top')) {
    if (newRect.height - vector.y >= MIN_HEIGHT) {
      newRect.y += vector.y;
      newRect.height -= vector.y;
    }
  }
  if (anchor.includes('left')) {
    // don't allow the selection box to be smaller than the minimum width
    if (newRect.width - vector.x >= MIN_WIDTH) {
      newRect.x += vector.x;
      newRect.width -= vector.x;
    }
  }
  if (anchor.includes('right')) {
    newRect.width += vector.x;
  }
  if (anchor.includes('bottom')) {
    newRect.height += vector.y;
  }

  return rectWithinMin(newRect);
};
