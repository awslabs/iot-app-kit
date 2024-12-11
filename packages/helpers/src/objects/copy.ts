import cloneDeep from 'lodash-es/cloneDeep';

/**
 * Create a referentially pure copy of an object.
 */
export const copy = <T>(item: T) => cloneDeep(item);

if (import.meta.vitest) {
  const { test, expect, expectTypeOf } = import.meta.vitest;

  test('deep copy is made', () => {
    let original = {
      deep: {
        value: 10,
      },
      value: 1,
    };

    const shallowCopy = { ...original };

    expect(shallowCopy).toEqual(original);
    expect(shallowCopy).not.toBe(original);
    expect(shallowCopy.deep).toEqual(original.deep);
    expect(shallowCopy.deep).toBe(original.deep);
    expect(shallowCopy.value).toEqual(original.value);
    expect(shallowCopy.deep.value).toEqual(original.deep.value);

    shallowCopy.value += 1;
    shallowCopy.deep.value += 1;

    expect(shallowCopy.value).not.toEqual(original.value);
    expect(shallowCopy.deep.value).toEqual(original.deep.value);

    original = {
      deep: {
        value: 10,
      },
      value: 1,
    };

    const deepCopy = copy(original);

    expect(deepCopy).toEqual(original);
    expect(deepCopy).not.toBe(original);
    expect(deepCopy.deep).toEqual(original.deep);
    expect(deepCopy.deep).not.toBe(original.deep);
    expect(deepCopy.value).toEqual(original.value);
    expect(deepCopy.deep.value).toEqual(original.deep.value);

    deepCopy.value += 1;
    deepCopy.deep.value += 1;

    expect(shallowCopy.value).not.toEqual(original.value);
    expect(shallowCopy.deep.value).not.toEqual(original.deep.value);

    expectTypeOf(deepCopy).toEqualTypeOf<typeof original>;
  });
}
