import { combine as combineObjects } from '#objects/combine';
import { map } from './map';

export const combine = <A, B>(as: A[]) =>
  map((b: B, index) => combineObjects<A, B>(as[index])(b));

if (import.meta.vitest) {
  const { test, expectTypeOf } = import.meta.vitest;

  test('test', () => {
    expectTypeOf(combine([1, 2, 3])(['1', '2', '3'])).toEqualTypeOf<number[]>;
  });
}
