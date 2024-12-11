import type { CellIndex, CellSize } from './types';

/**
 * Calculate the index of a cell.
 */
export function cellIndex(cellSize: CellSize) {
  return (positionInPx: number): CellIndex => {
    if (cellSize === 0) return 0;

    return Math.floor(positionInPx / cellSize);
  };
}
