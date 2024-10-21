import { toGridPosition } from './position';

it('returns the correct position on the grid', () => {
  expect(toGridPosition({ x: 0, y: 0 }, 1)).toEqual({ x: 0, y: 0 });

  expect(toGridPosition({ x: 1, y: 1 }, 1)).toEqual({ x: 1, y: 1 });

  expect(toGridPosition({ x: 100, y: 100 }, 10)).toEqual({ x: 10, y: 10 });

  expect(toGridPosition({ x: -1, y: 0 }, 10)).toEqual({ x: -0.1, y: 0 });
});

it('does not break if the cell size is something nonsensical', () => {
  expect(toGridPosition({ x: 0, y: 0 }, 0)).toEqual({ x: 0, y: 0 });

  expect(toGridPosition({ x: 1, y: 1 }, -1)).toEqual({ x: 0, y: 0 });
});
