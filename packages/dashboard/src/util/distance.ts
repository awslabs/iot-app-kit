import { Position } from '../types';

export const distance = (pos1: Position, pos2: Position): number => {
  const { x: x1, y: y1 } = pos1;
  const { x: x2, y: y2 } = pos2;
  const y = x2 - x1;
  const x = y2 - y1;
  return Math.sqrt(x * x + y * y);
};
