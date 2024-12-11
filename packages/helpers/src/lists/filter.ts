export function filter<T, U>(
  fn: (item: T | U) => item is T
): (items: (T | U)[]) => T[];
export function filter<T, U>(
  fn: (item: T | U) => boolean
): (items: (T | U)[]) => T[];
export function filter<T, U>(
  fn: ((item: T | U) => item is T) | ((item: T | U) => boolean)
) {
  return (items: (T | U)[]) => {
    return items.filter(fn);
  };
}

if (import.meta.vitest) {
  const { test, expect, expectTypeOf } = import.meta.vitest;

  test('filters a list', () => {
    const dirtyList = [1, 2, 3, 4, 5];
    const onlyGreaterThan3 = filter((n: number) => n > 3);
    expect(onlyGreaterThan3(dirtyList)).toEqual([4, 5]);

    expect(true).toBe(true);
  });

  test('works', () => {
    const list: [1, 2, 'test', false, []] = [1, 2, 'test', false, []];
    expectTypeOf(list).toEqualTypeOf<[1, 2, 'test', false, []]>;

    const onlyNumbersAndBooleans = filter(
      (item: (typeof list)[number]) =>
        typeof item === 'number' || typeof item === 'boolean'
    );
    const list2 = onlyNumbersAndBooleans(list);

    expect(list2).toEqual([1, 2, false]);
    expectTypeOf(list2).toEqualTypeOf<(1 | 2 | false)[]>;
  });
}
