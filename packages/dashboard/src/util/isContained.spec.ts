import { isContained } from './isContained';

// Note: A degenerate rectangle is one with a side of length 0.

it('two degenerate rectangles contained on the same point are contained', () => {
  expect(isContained({ width: 0, height: 0, x: 0, y: 0 }, { width: 0, height: 0, x: 0, y: 0 })).toBe(true);
});

it('two degenerate rectangles contained on different points are not contained', () => {
  expect(isContained({ width: 0, height: 0, x: 0, y: 0 }, { width: 0, height: 0, x: 1, y: 1 })).toBe(false);
});

it('two degenerate rectangles contained on different points are not contained', () => {
  expect(isContained({ width: 0, height: 0, x: 0, y: 0 }, { width: 0, height: 0, x: 1, y: 1 })).toBe(false);
});

it('two rectangles have no overlap, then it is not contained', () => {
  expect(isContained({ width: 1, height: 1, x: 0, y: 0 }, { width: 2, height: 2, x: 3, y: 3 })).toBe(false);
});

it('two rectangles have overlap at the border, then it is contained', () => {
  expect(isContained({ width: 1, height: 1, x: 0, y: 0 }, { width: 2, height: 2, x: 1, y: 1 })).toBe(true);
});

it('two rectangles have overlap within the area contained in the rectangles, then it is contained', () => {
  expect(isContained({ width: 2, height: 2, x: 0, y: 0 }, { width: 2, height: 2, x: 1, y: 1 })).toBe(true);
});
