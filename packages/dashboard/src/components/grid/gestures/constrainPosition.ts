import { type Position } from '../../../types';

/**
 *
 * prevent a position from leaving the grid rectangle
 *
 */
export const constrainPosition = (params: {
  position: Position;
  gridSize: { width: number; height: number; x: number; y: number };
}) => {
  const { position, gridSize } = params;
  return {
    x: Math.min(Math.max(position.x, 0), gridSize.width),
    y: Math.min(Math.max(position.y, 0), gridSize.height),
  };
};
