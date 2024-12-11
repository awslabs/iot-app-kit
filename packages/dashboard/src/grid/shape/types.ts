import type { Position } from '#grid/position/types';

export type Shape<Dimensions = unknown> = Position & Dimensions;

export interface ShapeCreationOptions {
  round?: boolean;
}

export type Create<
  S extends Shape,
  Details extends S = S,
  Options extends ShapeCreationOptions = ShapeCreationOptions
> = (details: Details, options?: Options) => S;
