import {
  generateUUID,
  getScaleFactor,
  humanFileSize,
  decToHexString,
  hexStringToDec,
  parseFloatOrDefault,
  approximatelyEquals,
  EPSILON,
} from '../../src/utils/mathUtils';

describe('generateUUID', () => {
  it('should generate unique strings', () => {
    const str1 = generateUUID();
    const str2 = generateUUID();
    expect(str1).not.toBe(str2);
  });
});

describe('getScaleFactor', () => {
  it('should return correct scale factors', () => {
    let factor = getScaleFactor('meters', 'meters');
    expect(factor).toBe(1);

    factor = getScaleFactor('miles', 'meters');
    expect(factor).toBeCloseTo(1609.34);

    factor = getScaleFactor('miles', 'centimeters');
    expect(factor).toBeCloseTo(160934);

    factor = getScaleFactor('inches', 'centimeters');
    expect(factor).toBeCloseTo(2.54);
  });
});

describe('humanFileSize', () => {
  it('should return correctly formatted file size', () => {
    let res = humanFileSize(1, true, 2);
    expect(res).toBe('1 B');

    res = humanFileSize(10000, true, 2);
    expect(res).toBe('10.00 kB');

    res = humanFileSize(10240, false, 2);
    expect(res).toBe('10.00 KiB');
  });
});

describe('decToHexString', () => {
  it('should convert dec to hex string correctly', () => {
    expect(decToHexString(0xffffff)).toBe('#ffffff');
    expect(decToHexString(0x00ffff)).toBe('#00ffff');
  });
});

describe('hexStringToDec', () => {
  it('should convert hex string to dec correctly', () => {
    expect(hexStringToDec('#ffffff')).toBe(0xffffff);
    expect(hexStringToDec('#00ffff')).toBe(0x00ffff);
  });

  it('should return 0xffffff if the hex string is invalid', () => {
    expect(hexStringToDec('xyz')).toBe(0xffffff);
  });
});

describe('parseFloatOrDefault', () => {
  it('should parse float value correctly', () => {
    expect(parseFloatOrDefault('0.1', 0)).toBeCloseTo(0.1);
  });

  it('should return default value if failed to parse the float value', () => {
    expect(parseFloatOrDefault('N', 0)).toBeCloseTo(0);
  });
});

describe('approximatelyEquals', () => {
  it('should return true if numbers are equal', () => {
    expect(approximatelyEquals(1, 1)).toEqual(true);
    expect(approximatelyEquals(1.0001, 1.0001)).toEqual(true);
  });

  it('should return false if numbers are not equal', () => {
    expect(approximatelyEquals(1, 2)).not.toEqual(true);
    expect(approximatelyEquals(1.0001, 1.0005)).not.toEqual(true);
  });

  it('should return true if numbers are approximately equal', () => {
    const a = 1;
    const b = a + EPSILON;
    expect(approximatelyEquals(a, b)).toEqual(true);
  });
});
