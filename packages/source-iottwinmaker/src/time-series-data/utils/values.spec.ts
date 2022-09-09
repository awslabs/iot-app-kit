import { isDefined, toDataPoint, toDataStream, toDataType, toValue } from './values';

describe('isDefined', () => {
  it('should return true when value is defined', () => {
    expect(isDefined('0')).toBeTruthy();
    expect(isDefined({})).toBeTruthy();
    expect(isDefined(0)).toBeTruthy();
    expect(isDefined(NaN)).toBeTruthy();
    expect(isDefined(false)).toBeTruthy();
  });

  it('should return false when value is nullish', () => {
    expect(isDefined(undefined)).toBeFalsy();
    expect(isDefined(null)).toBeFalsy();
  });
});

describe('toValue', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return undefined when no value is defined', () => {
    expect(toValue({ doubleValue: undefined })).toBeUndefined();
    expect(console.warn).toBeCalledTimes(1);
  });

  it('should return number when number value is defined', () => {
    expect(toValue({ doubleValue: 123.4 })).toEqual(123.4);
    expect(toValue({ integerValue: 1234 })).toEqual(1234);
    expect(toValue({ longValue: 1234 })).toEqual(1234);
  });

  it('should return boolean string when boolan value is defined', () => {
    expect(toValue({ booleanValue: true })).toEqual('true');
    expect(toValue({ booleanValue: false })).toEqual('false');
  });

  it('should return string when other values are defined', () => {
    expect(toValue({ stringValue: 'test' })).toEqual('test');
    expect(toValue({ listValue: [{ booleanValue: true }] })).toEqual('[{"booleanValue":true}]');
    expect(toValue({ mapValue: { test: { booleanValue: true } } })).toEqual('{"test":{"booleanValue":true}}');
    expect(toValue({ expression: 'a == 40' })).toEqual('a == 40');
    expect(toValue({ relationshipValue: { targetEntityId: 'entity-1', targetComponentName: 'comp-1' } })).toEqual(
      '{"targetEntityId":"entity-1","targetComponentName":"comp-1"}'
    );
  });
});

describe('toDataPoint', () => {
  it('should return undefined when input is not defined', () => {
    expect(toDataPoint(undefined)).toBeUndefined();
  });

  it('should return undefined when value or time is not defined', () => {
    expect(toDataPoint({ value: undefined, time: 'time' })).toBeUndefined();
    expect(toDataPoint({ value: { integerValue: 1 }, time: undefined })).toBeUndefined();
    expect(toDataPoint({ value: { integerValue: undefined }, time: 'time' })).toBeUndefined();
  });

  it('should return expected dataPoint', () => {
    const timeString = '2022/01/01 12:20:30';
    expect(toDataPoint({ value: { integerValue: 1 }, time: new Date(timeString).toISOString() })).toEqual({
      x: new Date(timeString).getTime(),
      y: 1,
    });
  });
});

describe('toDataStream', () => {
  it('should return expected data stream', () => {
    const meta = { entityId: 'entity', componentName: 'comp', propertyName: 'prop' };
    const input = { streamId: 'test-stream', dataPoints: [{ x: 123456, y: 'value' }], ...meta };
    expect(toDataStream(input)).toEqual({ id: input.streamId, data: input.dataPoints, resolution: 0, meta });
  });
});

describe('toDataType', () => {
  it('should return undefined when type is not defined', () => {
    expect(toDataType({ type: undefined })).toBeUndefined();
  });

  it('should return BOOLEAN', () => {
    expect(toDataType({ type: 'BOOLEAN' })).toEqual('BOOLEAN');
  });

  it('should return NUMBER', () => {
    expect(toDataType({ type: 'DOUBLE' })).toEqual('NUMBER');
    expect(toDataType({ type: 'INTEGER' })).toEqual('NUMBER');
    expect(toDataType({ type: 'LONG' })).toEqual('NUMBER');
  });

  it('should return STRING', () => {
    expect(toDataType({ type: 'LIST' })).toEqual('STRING');
    expect(toDataType({ type: 'MAP' })).toEqual('STRING');
    expect(toDataType({ type: 'RELATIONSHIP' })).toEqual('STRING');
    expect(toDataType({ type: 'STRING' })).toEqual('STRING');
    expect(toDataType({ type: 'RANDOM' })).toEqual('STRING');
  });
});
