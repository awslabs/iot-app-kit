import { resizeSelectionBox } from '~/util/resizeSelectionBox';
import type { Anchor } from '~/store/actions';
import type { Rect } from '~/types';
import type { DashboardState } from '~/store/state';

const grid = {
  width: 150,
  height: 150,
  cellSize: 1,
} as DashboardState['grid'];
it('should resize selection box on top anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 10, width: 100, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on top-left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top-left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 10, width: 90, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on top-right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top-right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 10, width: 110, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on bottom anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 100, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on bottom-left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom-left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 0, width: 90, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on bottom-right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom-right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 110, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 0, width: 90, height: 100 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

it('should resize selection box on right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 110, height: 100 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid })).toEqual(expected);
});

describe('should not vertically resize selection box below minimum width', () => {
  const curr = { x: 50, y: 50, width: 2, height: 100 };
  const leftAnchors: Anchor[] = ['top', 'top-left', 'bottom-left'];
  leftAnchors.forEach((anchor) => {
    const vector = { x: 10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid }).width).toEqual(2);
    });
  });

  const rightAnchors: Anchor[] = ['top-right', 'bottom-right', 'right'];
  rightAnchors.forEach((anchor) => {
    const vector = { x: -10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid }).width).toEqual(2);
    });
  });
});

describe('should not horizontally resize selection box below minimum height', () => {
  const curr = { x: 50, y: 50, width: 100, height: 2 };
  const topAnchors: Anchor[] = ['top', 'top-left', 'top-right'];
  topAnchors.forEach((anchor) => {
    const vector = { x: 10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid }).height).toEqual(2);
    });
  });

  const bottomAnchors: Anchor[] = ['bottom-left', 'bottom-right', 'bottom'];
  bottomAnchors.forEach((anchor) => {
    const vector = { x: 10, y: -10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector, grid }).height).toEqual(2);
    });
  });
});
const withinGrid = (newRect: Rect, gridRect: Rect) => {
  const { x, y, width, height } = newRect;
  const { x: gridX, y: gridY, width: gridWidth, height: gridHeight } = gridRect;

  return x >= gridX && y >= gridY && x + width <= gridX + gridWidth && y + height <= gridY + gridHeight;
};
describe('should not resize selection box beyond grid', () => {
  const anchors: Anchor[] = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'left', 'right'];
  const startingPoints = [
    { x: 0, y: 0 },
    { x: 90, y: 0 },
    { x: 0, y: 90 },
    { x: 90, y: 90 },
  ];
  const vectors = [
    { x: 20, y: 20 },
    { x: -20, y: 20 },
    { x: 20, y: -20 },
    { x: -20, y: -20 },
  ];
  type TestCase = { anchor: Anchor; startingPoint: typeof startingPoints[number]; vector: typeof vectors[number] };
  const table: TestCase[] = anchors.flatMap((anchor) =>
    startingPoints.flatMap((startingPoint) => vectors.map((vector) => ({ anchor, startingPoint, vector })))
  );

  it.concurrent.each(table)('on $anchor from $startingPoint with $vector', ({ anchor, startingPoint, vector }) => {
    const curr = { x: startingPoint.x, y: startingPoint.y, width: 10, height: 10 };
    const newRect = resizeSelectionBox({ selectionBox: curr, anchor, vector, grid });
    expect(
      withinGrid(newRect, {
        x: 0,
        y: 0,
        ...grid,
      })
    ).toBe(true);
  });
});
