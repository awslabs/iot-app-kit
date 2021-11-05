import { DataStream, DataStreamInfo, DataType, MinimalLiveViewport, MinimalStaticViewport } from '@synchro-charts/core';
import {
  isNumber,
  isDefined,
  isNumberDataStream,
  isSupportedDataType,
  isValid,
  isMinimalStaticViewport,
} from './predicates';

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

describe('isNumberDataStream', () => {
  const NUMBER_DATA_STREAM: DataStream<number> = {
    id: 'number-id',
    resolution: 0,
    name: 'stream-name',
    dataType: DataType.NUMBER,
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
    dataType: DataType.STRING,
    resolution: 0,
    data: [
      {
        x: Date.now(),
        y: 'some string',
      },
    ],
  };

  const EMPTY_STRING_STREAM: DataStream<string> = { ...STRING_DATA_STREAM, data: [] };

  const EMPTY_NUMBER_STREAM: DataStream<number> = { ...NUMBER_DATA_STREAM, data: [] };

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

describe('isMinimalStaticViewPort', () => {
  it('returns false when the viewport is minimal live viewport config', () => {
    const viewport: MinimalLiveViewport = {
      yMin: 0,
      yMax: 10,
      duration: 1000,
    };

    expect(isMinimalStaticViewport(viewport)).toBeFalse();
  });

  it('returns true when the viewport is minimal static viewport config', () => {
    const viewport: MinimalStaticViewport = {
      yMin: 0,
      yMax: 10,
      start: new Date(),
      end: new Date(),
    };

    expect(isMinimalStaticViewport(viewport)).toBeTrue();
  });

  it('returns false when the end date is missing', () => {
    const viewport: Omit<MinimalStaticViewport, 'end'> = {
      yMin: 0,
      yMax: 10,
      start: new Date(),
    };

    expect(isMinimalStaticViewport(viewport as unknown as MinimalLiveViewport)).toBeFalse();
  });

  it('returns false when the start date is missing', () => {
    const viewport: Omit<MinimalStaticViewport, 'start'> = {
      yMin: 0,
      yMax: 10,
      end: new Date(),
    };

    expect(isMinimalStaticViewport(viewport as unknown as MinimalLiveViewport)).toBeFalse();
  });
});
