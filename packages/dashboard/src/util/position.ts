import invariant from 'tiny-invariant';
import type { Position as OldPosition } from '../types';
import type { Point } from '#grid/point/types';

/**
 *
 * Scale a position in real pixels on the grid to its grid position based on the grid cell size
 *
 */
export const toGridPosition = (
  position: OldPosition,
  cellSize: number
): OldPosition => {
  if (cellSize <= 0) return { x: 0, y: 0 };

  return {
    x: pxToCells(position.x, cellSize),
    y: pxToCells(position.y, cellSize),
  };
};

export function cellPosition(positionInPx: Point, cellSize: number): Point {
  invariant(cellSize > 0, 'Expected valid cell size.');

  return {
    x: pxToCells(positionInPx.x, cellSize),
    y: pxToCells(positionInPx.y, cellSize),
  };
}

export function pxToCells(px: number, cellSize: number): number {
  return Math.floor(px / cellSize);
}
