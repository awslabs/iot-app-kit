import { DATA_TYPE } from '@iot-app-kit/core';
import { isNumber, isNumberDataStream, isValid } from './predicates';
import type { DataStream } from '@iot-app-kit/core';

describe('isValid', () => {
  it('returns true when pass in a predicate that always returns true.', () => {
    expect(isValid(() => true)(true)).toBe(true);
  });
});

describe('isNumberDataStream', () => {
  const NUMBER_DATA_STREAM: DataStream<number> = {
    id: 'number-id',
    resolution: 0,
    name: 'stream-name',
    dataType: DATA_TYPE.NUMBER,
    data: [
      {
        x: Date.now(),
        y: 123.456,
      },
    ],
  };

  const STRING_DATA_STREAM: DataStream<string> = {
    id: 'string-id',
    name: 'stream-name',
    dataType: DATA_TYPE.STRING,
    resolution: 0,
    data: [
      {
        x: Date.now(),
        y: 'some string',
      },
    ],
  };

  const EMPTY_STRING_STREAM: DataStream<string> = {
    ...STRING_DATA_STREAM,
    data: [],
  };

  const EMPTY_NUMBER_STREAM: DataStream<number> = {
    ...NUMBER_DATA_STREAM,
    data: [],
  };

  it('returns true when given empty number stream', () => {
    expect(isNumberDataStream(EMPTY_NUMBER_STREAM)).toBe(true);
  });

  it('returns false when given empty string stream', () => {
    expect(isNumberDataStream(EMPTY_STRING_STREAM)).toBe(false);
  });

  it('returns false when given string stream', () => {
    expect(isNumberDataStream(STRING_DATA_STREAM)).toBe(false);
  });

  it('returns true when given number stream', () => {
    expect(isNumberDataStream(NUMBER_DATA_STREAM)).toBe(true);
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
