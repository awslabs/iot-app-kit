import { sortPoints } from './sort';
import type { DataPoint } from '@iot-app-kit/core';

const POINT_1: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 0,
};

const POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 10,
};

const TOOLTIP_POINT_1 = { point: POINT_1 };
const TOOLTIP_POINT_2 = { point: POINT_2 };
const UNDEFINED_TOOLTIP_POINT: { point: undefined } = { point: undefined };

it('returns points in decreasing order of y value', () => {
  expect(
    [TOOLTIP_POINT_1, TOOLTIP_POINT_2].sort(sortPoints((p) => p.y))
  ).toEqual([TOOLTIP_POINT_2, TOOLTIP_POINT_1]);
});

it('maintains order of items in correct order', () => {
  expect(
    [TOOLTIP_POINT_1, TOOLTIP_POINT_2].sort(sortPoints((p) => p.x))
  ).toEqual([TOOLTIP_POINT_1, TOOLTIP_POINT_2]);
});

it('returns undefined points first', () => {
  expect(
    [TOOLTIP_POINT_1, UNDEFINED_TOOLTIP_POINT, TOOLTIP_POINT_2].sort(
      sortPoints((p) => p.y)
    )
  ).toEqual([UNDEFINED_TOOLTIP_POINT, TOOLTIP_POINT_2, TOOLTIP_POINT_1]);
});
