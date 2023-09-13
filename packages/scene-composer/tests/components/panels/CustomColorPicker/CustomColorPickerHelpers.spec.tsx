import {
  RGB,
  RgbToHex,
  hexToRgb,
  isValidHex,
  validateHex,
  validateRgbValue,
} from '../../../../src/components/panels/CustomColorPicker/CustomColorPickerHelpers';

const exampleColorHex = '#111111';
const exampleColorHexShort = '#111';
const exampleColorRgb: RGB = {
  r: '17',
  g: '17',
  b: '17',
};

describe('Color picker utility functions', () => {
  it('should convert hex to rgb', () => {
    expect(hexToRgb(exampleColorHex)).toStrictEqual(exampleColorRgb);
    expect(hexToRgb(exampleColorHexShort)).toStrictEqual(exampleColorRgb);
  });

  it('should validate hex inputs', () => {
    expect(validateHex(exampleColorHex)).toStrictEqual(exampleColorHex);
    expect(validateHex(exampleColorHexShort)).toStrictEqual(exampleColorHexShort);
    expect(validateHex('')).toBe('#');
    expect(validateHex('#')).toBe('#');
    expect(validateHex('#~!@#$]/vplo')).toBe('#');
    expect(validateHex('#abc123')).toBe('#abc123');
    expect(validateHex('#12345678')).toBe('#123456');
    expect(validateHex('#123ppp')).toBe('#123');
  });

  it('should check validity of hex inputs', () => {
    expect(isValidHex(exampleColorHex)).toBeTruthy();
    expect(isValidHex(exampleColorHexShort)).toBeTruthy();
    expect(isValidHex('#abc123')).toBeTruthy();

    expect(isValidHex('')).toBeFalsy();
    expect(isValidHex('#')).toBeFalsy();
    expect(isValidHex('#~!@#$]/vplo')).toBeFalsy();
    expect(isValidHex('#12345678')).toBeFalsy();
    expect(isValidHex('#123ppp')).toBeFalsy();
  });

  it('should validate rgb values', () => {
    expect(validateRgbValue('')).toBe('0');
    expect(validateRgbValue('0')).toBe('0');
    expect(validateRgbValue('1')).toBe('1');
    expect(validateRgbValue('123')).toBe('123');
    expect(validateRgbValue('1234')).toBe('255');
    expect(validateRgbValue('abc')).toBe('0');
    expect(validateRgbValue('abc123')).toBe('123');
  });

  it('should convert rgb values to hexidecimal correctly', () => {
    expect(RgbToHex(exampleColorRgb)).toStrictEqual(exampleColorHex);
    expect(
      RgbToHex({
        r: '',
        g: '0',
        b: '1',
      }),
    ).toStrictEqual('#000001');
  });
});
