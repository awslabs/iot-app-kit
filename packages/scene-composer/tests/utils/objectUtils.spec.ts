import * as shallow from 'zustand/shallow';

import { appendFunction, isObject, mergeDeep, shallowEqualsArray } from '../../src/utils/objectUtils';

describe('objectUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return expected result for isObject', () => {
    const object = {};
    const number = 1;
    const array = [];
    expect(isObject(object)).toEqual(true);
    expect(isObject(number)).toEqual(false);
    expect(isObject(array)).toEqual(false);
  });

  it('should merge multiple objects with depth when calling merge deep', () => {
    const a = { foo: 'test' };
    const b = { bar: { baz: 'test' } };
    const c = { poo: 'done' };
    const expected = {
      foo: 'test',
      bar: { baz: 'test' },
      poo: 'done',
    };

    expect(mergeDeep(a, b, c)).toEqual(expected);
  });

  it('should call zustand shallow expected number of times when calling shallowEqualsArray', () => {
    vi.spyOn(shallow, 'default');
    const a = { test: 'test' };
    const b = { test: 'test' };
    const c = { test: 'bad' };

    expect(shallowEqualsArray([a, b, a, b, a, b, a, b, a, b], [b, a, b, a, b, a, b, a, b, a])).toEqual(true);

    expect(shallow.default).toBeCalledTimes(10);

    expect(shallowEqualsArray([a], undefined as any)).toEqual(false);
    expect(shallowEqualsArray(undefined as any, [b])).toEqual(false);
    expect(shallowEqualsArray([a, b], [a])).toEqual(false);
    expect(shallowEqualsArray([a, b, a], [b, c, a])).toEqual(false);
    expect(shallow.default).toBeCalledTimes(12);
  });

  it('should append 2 functions with appendFunction', () => {
    const second = vi.fn();
    const first = vi.fn(() => {
      expect(second).not.toBeCalled();
    });

    appendFunction(first, second)('test1', 'test2');
    expect(first).toHaveBeenCalledWith('test1', 'test2');
    expect(second).toHaveBeenCalledWith('test1', 'test2');
  });
});
