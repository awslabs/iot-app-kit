import {
  compareDataFrameLabel,
  createDataFrameLabelPart,
  createDataFrameLabel,
  decodeDataFrameLabel,
} from '../../src/utils/dataFrameLabelUtils';

describe('createDataFrameLabelPart', () => {
  it('should return dataFrameLabel part with valid input', async () => {
    const result = createDataFrameLabelPart({ key2: 'value2', key1: 'value1', key3: 'value 3' });
    expect(result).toEqual('key1=value1&key2=value2&key3=value%203');
  });

  it('should return dataFrameLabel part with valid input with 1 key', async () => {
    const result = createDataFrameLabelPart({ key1: 'value1' });
    expect(result).toEqual('key1=value1');
  });

  it('should return empty string with empty input', async () => {
    const result = createDataFrameLabelPart({});
    expect(result).toEqual('');
  });
});

describe('createDataFrameLabel & decodeDataFrameLabel', () => {
  it('should return dataFrameLabel with valid input', async () => {
    const input: Record<string, string>[] = [
      { p1: 'p1-value' },
      { p3: 'p3-value', 'a=a': '!@#$%' },
      { p2: 'p2-value' },
    ];
    const encoded = 'p1%3Dp1-value,a%253Da%3D!%2540%2523%2524%2525%26p3%3Dp3-value,p2%3Dp2-value';

    // encode
    const result = createDataFrameLabel(input);
    expect(result).toEqual(encoded);

    // decode
    expect(decodeDataFrameLabel(result)).toEqual(input);
  });

  it('should return dataFrameLabel with valid input with 1 key', async () => {
    const input: Record<string, string>[] = [{ p1: 'p1-value' }];
    const encoded = 'p1%3Dp1-value';

    // encode
    const result = createDataFrameLabel(input);
    expect(result).toEqual(encoded);

    // decode
    expect(decodeDataFrameLabel(result)).toEqual(input);
  });

  it('should return empty string with empty input', async () => {
    const input: Record<string, string>[] = [];
    const encoded = '';

    // encode
    const result = createDataFrameLabel(input);
    expect(result).toEqual(encoded);

    // decode
    expect(decodeDataFrameLabel(result)).toEqual(input);
  });

  it('should return empty array when decoding the label that is not with the expected format', async () => {
    const randomString = 'abcdefg';
    expect(decodeDataFrameLabel(randomString)).toEqual([]);
  });
});

describe('compareDataFrameLabel', () => {
  it('should return true if label1 matches label2', async () => {
    expect(compareDataFrameLabel('ABC%3D123,DEF%3D234,123%3D321', '456%3D123,DEF%3D234')).toBe(true);
    expect(compareDataFrameLabel('ABC%3D123', 'ABC%3D123')).toBe(true);
  });

  it('should return false if either label1 or label2 is empty', async () => {
    expect(compareDataFrameLabel('', '456%3D123,DEF%3D123')).toBe(false);
    expect(compareDataFrameLabel('ABC%3D123,DEF%3D123,123%3D321', '')).toBe(false);
    expect(compareDataFrameLabel(undefined as any, '456%3D123,DEF%3D321')).toBe(false);
    expect(compareDataFrameLabel('ABC%3D123,DEF%3D321,123%3Dxyz', undefined as any)).toBe(false);
  });

  it('should return false if both label1 and label2 are empty', async () => {
    // NOTE: empty labels are not valid labels
    expect(compareDataFrameLabel('', '')).toBe(false);
    expect(compareDataFrameLabel(undefined as any, undefined as any)).toBe(false);
  });
});
