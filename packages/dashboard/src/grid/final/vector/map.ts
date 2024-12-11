import type { Vector } from './types';
import {
  type Entry,
  fromEntries,
  toEntries,
} from '@iot-app-kit/helpers/objects/entries';
import { map as mapList } from '@iot-app-kit/helpers/lists/map';
import type { ValueOf } from 'type-fest';
import pipe from '@iot-app-kit/helpers/functions/pipe';

export default (fn: (v: ValueOf<Vector>) => ValueOf<Vector>) =>
  (vector: Vector): Vector => {
    return pipe(
      vector,
      toEntries,
      mapList<Entry<Vector>>(([k, v]) => [k, fn(v)]),
      fromEntries
    );
  };
