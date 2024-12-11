import { isDefined } from '#predicates/isDefined';
import { filter } from './filter';

export const compact = filter(isDefined);

if (import.meta.vitest) {
  const { test, expect, expectTypeOf } = import.meta.vitest;

  test('compacts a ubiquitous sparse list', () => {
    const sparseList = [1, undefined, 2, null, 3];
    const compactList = compact(sparseList);

    expect(compactList).toEqual([1, 2, 3]);
    expectTypeOf(compactList).toEqualTypeOf<number[]>;
    expectTypeOf(compactList).not.toEqualTypeOf<typeof sparseList>;
  });

  test('compacts a mixed sparse list', () => {
    const sparseList = [123, undefined, 'abc', null, true];
    const compactList = compact(sparseList);

    expect(compactList).toEqual([123, 'abc', true]);
    expectTypeOf(compactList).toEqualTypeOf<(number | string | boolean)[]>;
    expectTypeOf(compactList).not.toEqualTypeOf<typeof sparseList>;
  });
}
