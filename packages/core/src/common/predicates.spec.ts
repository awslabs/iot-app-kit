import {
  isNumber,
  isDefined,
  isNumberDataStream,
  isSupportedDataType,
  isValid,
  isHistoricalViewport,
} from './predicates';
import type { DataStream } from '../data-module/types';
import type {
  HistoricalViewport,
  DurationViewport,
} from '../data-module/data-cache/requestTypes';

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
    expect(isSupportedDataType(false)({ dataType: 'STRING' })).toBeFalse();
  });

  it('returns true when data stream is a type of string and support string is true ', () => {
    expect(
      isSupportedDataType(true)({
        dataType: 'STRING',
      })
    ).toBeTrue();
  });

  it('returns true when the data stream is not a type of string. Disregards the support string boolean', () => {
    expect(isSupportedDataType(true)({ dataType: 'NUMBER' })).toBeTrue();
    expect(isSupportedDataType(false)({ dataType: 'NUMBER' })).toBeTrue();
  });
});

describe('isNumberDataStream', () => {
  const NUMBER_DATA_STREAM: DataStream<number> = {
    id: 'number-id',
    resolution: 0,
    name: 'stream-name',
    dataType: 'NUMBER',
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
    dataType: 'STRING',
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
    expect(isNumberDataStream(EMPTY_NUMBER_STREAM)).toBeTrue();
  });

  it('returns false when given empty string stream', () => {
    expect(isNumberDataStream(EMPTY_STRING_STREAM)).toBeFalse();
  });

  it('returns false when given string stream', () => {
    expect(isNumberDataStream(STRING_DATA_STREAM)).toBeFalse();
  });

  it('returns true when given number stream', () => {
    expect(isNumberDataStream(NUMBER_DATA_STREAM)).toBeTrue();
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

describe('isHistoricalViewport', () => {
  it('returns false when the viewport is a duration viewport', () => {
    const viewport: DurationViewport = {
      duration: 1000,
    };

    expect(isHistoricalViewport(viewport)).toBeFalse();
  });

  it('returns true when the viewport is a historical viewport', () => {
    const viewport: HistoricalViewport = {
      start: new Date(),
      end: new Date(),
    };

    expect(isHistoricalViewport(viewport)).toBeTrue();
  });

  it('returns false when the end date is missing', () => {
    expect(
      isHistoricalViewport({ start: new Date() } as unknown as DurationViewport)
    ).toBeFalse();
  });

  it('returns false when the start date is missing', () => {
    expect(
      isHistoricalViewport({ end: new Date() } as unknown as DurationViewport)
    ).toBeFalse();
  });
});
