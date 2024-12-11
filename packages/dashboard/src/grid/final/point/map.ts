import type { Point } from './types';
import {
  type Entry,
  fromEntries,
  toEntries,
} from '@iot-app-kit/helpers/objects/entries';
import { map as mapList } from '@iot-app-kit/helpers/lists/map';
import type { ValueOf } from 'type-fest';
import pipe from '@iot-app-kit/helpers/functions/pipe';

export default (fn: (v: ValueOf<Point>) => ValueOf<Point>) =>
  (point: Point): Point => {
    return pipe(
      point,
      toEntries,
      mapList<Entry<Point>>(([k, v]) => [k, fn(v)]),
      fromEntries
    );
  };
