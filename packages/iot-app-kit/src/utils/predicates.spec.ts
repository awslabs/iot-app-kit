import { DataStreamInfo, DataType } from '@synchro-charts/core';
import { isNumber, isDefined, isSupportedDataType, isValid } from './predicates';

describe('isDefined', () => {
  it('returns false when passed null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('returns false when passed undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('returns true when passed 0', () => {
    expect(isDefined(0)).toBe(true);
  });

  it('returns true when passed NaN', () => {
    expect(isDefined(NaN)).toBe(true);
  });

  it('returns true when passed an object', () => {
    expect(isDefined({})).toBe(true);
  });
});

describe('isValid', () => {
  it('returns true when pass in a predicate that always returns true.', () => {
    expect(isValid(() => true)(true)).toBe(true);
  });
});

describe('isSupportedDataType', () => {
  it('returns false when data stream is a type of string but support string is false ', () => {
    const dataStreamInfo: DataStreamInfo = {
      id: 'asdf',
      resolution: 0,
      name: 'new name',
      dataType: DataType.STRING,
      color: 'red',
    };
    expect(isSupportedDataType(false)(dataStreamInfo)).toBeFalse();
  });

  it('returns true when data stream is a type of string and support string is true ', () => {
    const dataStreamInfo: DataStreamInfo = {
      id: 'asdf',
      resolution: 0,
      name: 'new name',
      dataType: DataType.STRING,
      color: 'red',
    };
    expect(isSupportedDataType(true)(dataStreamInfo)).toBeTrue();
  });

  it('returns true when the data stream is not a type of string. Disregards the support string boolean', () => {
    const dataStreamInfo: DataStreamInfo = {
      id: 'asdf',
      resolution: 0,
      name: 'new name',
      dataType: DataType.NUMBER,
      color: 'red',
    };
    expect(isSupportedDataType(true)(dataStreamInfo)).toBeTrue();

    const dataStreamInfo2: DataStreamInfo = {
      id: 'asdf',
      resolution: 0,
      name: 'new name',
      dataType: DataType.NUMBER,
      color: 'red',
    };
    expect(isSupportedDataType(false)(dataStreamInfo2)).toBeTrue();
  });
});

describe('isNumber', () => {
  describe.each`
    value         | expected
    ${''}         | ${false}
    ${new Date()} | ${false}
    ${123}        | ${true}
    ${true}       | ${false}
    ${'TEST'}     | ${false}
    ${'123'}      | ${false}
    ${123.3}      | ${true}
    ${NaN}        | ${true}
    ${12e3}       | ${true}
  `('checks if value is a number', ({ value, expected }) => {
    test(`${value}) is  ${expected ? '' : 'not '}a number`, () => {
      expect(isNumber(value)).toBe(expected);
    });
  });
});
