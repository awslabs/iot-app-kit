import type { Shape } from './types';

export interface CreateShapeOptions {
  round?: boolean;
}

export function createShape<ShapeDimensions>(
  create: (
    shape: Shape<ShapeDimensions>,
    options: CreateShapeOptions
  ) => Shape<ShapeDimensions>
) {
  return (
    shape: Shape<ShapeDimensions>,
    options: CreateShapeOptions = {}
  ): Shape<ShapeDimensions> => {
    return create(shape, options);
  };
}
