import { createPoint, type CreatePointOptions } from '#grid/point/create';
import { Position } from './types';

export type CreatePositionOptions = CreatePointOptions;

export function createPosition(
  position: Position,
  options: CreatePositionOptions = {}
): Position {
  return createPoint(position, options);
}
