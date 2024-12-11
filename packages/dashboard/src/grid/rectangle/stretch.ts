import type { CellLength } from '#grid/cell/types';
import { placeWithinRectangle } from '#grid/rectangle/nest';
import type { Anchor, Rectangle } from '#grid/rectangle/types';
import { type DashboardState } from '../../store/state-old';
import type {
  Position as OldPosition,
  Rectangle as OldRectangle,
} from '../../types';
import type { Split } from 'type-fest';

const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;
const rectWithinMin = (rect: OldRectangle): OldRectangle => {
  const { width, height } = rect;

  return {
    ...rect,
    width: Math.max(width, MIN_WIDTH),
    height: Math.max(height, MIN_HEIGHT),
  };
};
export const resizeSelectionBox: (params: {
  selectionBox: OldRectangle;
  anchor: Anchor;
  vector: OldPosition;
  grid: DashboardState['grid'];
}) => OldRectangle = ({
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

export type RectangleSide = 'left' | 'right' | 'top' | 'bottom';

function listSides(anchor: Anchor): Split<Anchor, '-'> {
  return anchor.split('-') as Split<Anchor, '-'>;
}

export function stretch(
  rectangle: Rectangle,
  offset: { x: CellLength; y: CellLength },
  anchor: Anchor
): Rectangle {
  return listSides(anchor).reduce(({ x, y, width, height }, side) => {
    switch (side) {
      case 'left': {
        return { x: x + offset.x, y, width: width - offset.x, height };
      }

      case 'right': {
        return { x, y, width: width + offset.x, height };
      }

      case 'top': {
        return { x, y: y + offset.y, width, height: height - offset.y };
      }

      case 'bottom': {
        return { x, y, width, height: height + offset.y };
      }
    }
  }, rectangle);
}

export function stretchWithin(
  rectangle: Rectangle,
  offset: { x: CellLength; y: CellLength },
  side: 'left' | 'right' | 'top' | 'bottom',
  container: Rectangle
): Rectangle {
  return placeWithinRectangle(stretch(rectangle, offset, side), container);
}
