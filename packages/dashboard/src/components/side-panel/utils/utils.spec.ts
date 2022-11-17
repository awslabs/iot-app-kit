import { getProperty, setProperty } from './index';

describe('getProperty', () => {
  it('returns value from nested object', () => {
    const obj = {
      foo: {
        bar: 1,
      },
    };
    expect(getProperty('foo', obj)).toMatchObject({ bar: 1 });
    expect(getProperty('foo.bar', obj)).toEqual(1);
  });

  it('returns value from array', () => {
    const obj = {
      arr: [1, 2, 3, 4],
    };
    expect(getProperty('arr.0', obj)).toEqual(1);
  });

  it('returns undefined for invalid path', () => {
    const obj = {
      foo: {
        bar: 10,
      },
    };
    expect(getProperty('foo.barz', obj)).toBeUndefined();
  });
});

describe('setProperty', () => {
  it('does not mutate original object', () => {
    const obj = { foo: 10 };
    setProperty('foo', 20, obj);
    expect(obj).toMatchObject({ foo: 10 });
  });

  it('updates a property of object', () => {
    const obj = { foo: 10 };
    expect(setProperty('foo', 20, obj)).toMatchObject({ foo: 20 });
  });

  it('updates a property of a nested object', () => {
    const obj = {
      foo: {
        bar: 10,
      },
    };
    expect(setProperty('foo.bar', 20, obj)).toMatchObject({ foo: { bar: 20 } });
  });

  it('updates a property of a object nested in an array', () => {
    const obj = {
      arr: [{ foo: 10, bar: 'x' }, { foo: 20 }],
    };
    expect(setProperty('arr.0.foo', 20, obj)).toMatchObject({
      arr: [{ foo: 20, bar: 'x' }, { foo: 20 }],
    });
    expect(obj).toMatchObject({
      arr: [{ foo: 10, bar: 'x' }, { foo: 20 }],
    });
  });

  it('added new element to an array', () => {
    const obj = {
      arr: [{ foo: 10 }, { foo: 20 }],
    };

    const newObj = setProperty('arr.2', { foo: 15 }, obj);
    expect(newObj).toMatchObject({
      arr: [{ foo: 10 }, { foo: 20 }, { foo: 15 }],
    });
    expect(obj).toMatchObject({
      arr: [{ foo: 10 }, { foo: 20 }],
    });
  });
});
