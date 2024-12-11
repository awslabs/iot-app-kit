export const isDefined = <T>(value: T | null | undefined) => value != null;

if (import.meta.vitest) {
  const { test, expect, expectTypeOf } = import.meta.vitest;

  test.each([123, 0, 'abc', '', true, false, {}, [], NaN])(
    'isDefined(%j) -> true',
    (value) => {
      expect(isDefined(value)).toBe(true);
    }
  );

  test.each([null, undefined])('isDefined(%j) -> false', (value) => {
    expect(isDefined(value)).toBe(false);
  });

  test('makes a value non-null', () => {
    const maybeValueA = 'value' as string | undefined | null;

    expectTypeOf(maybeValueA).toEqualTypeOf<string | undefined | null>;

    if (isDefined(maybeValueA)) {
      expectTypeOf(maybeValueA).toEqualTypeOf<string>;
      expectTypeOf(maybeValueA).not.toEqualTypeOf<string | undefined | null>;
    }
  });
}
