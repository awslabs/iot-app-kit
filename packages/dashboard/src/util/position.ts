import type { Position } from '~/types';

/**
 * Scale a position in real pixels on the grid to its grid position based on the grid cell size.
 */
export const toGridPosition = (
  position: Position,
  cellSize: number
): Position => {
  if (cellSize <= 0) return { x: 0, y: 0 };

  return {
    x: position.x / cellSize,
    y: position.y / cellSize,
  };
};
