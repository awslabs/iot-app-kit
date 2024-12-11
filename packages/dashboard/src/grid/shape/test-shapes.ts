import type { Shape } from './types';
import type { Rectangle } from '#grid/rectangle/types';
import type { Position } from '#grid/position/types';

export type Translate = (position: Position) => (offset: Position) => Position;
export type Intersects<S extends Shape> = (shape: S) => (shape: S) => boolean;
export type Surround<S extends Shape> = (shapes: S[]) => S;
export type Contain<S extends Shape> = (shape: S) => (shape: S) => S;
export type Scale<Dimension extends number> = (
  magnification: number
) => (dimension: Dimension) => Dimension;
