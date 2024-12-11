import { placeWithinRectangle } from '#grid/rectangle/nest';
import type { Rectangle } from './rectangle/types';
import type { Grid } from './types';
import type { SetParameterType } from 'type-fest';

type PlaceWithinGrid = SetParameterType<
  typeof placeWithinRectangle,
  [Rectangle, Grid]
>;

export const placeWithinGrid: PlaceWithinGrid = placeWithinRectangle;
