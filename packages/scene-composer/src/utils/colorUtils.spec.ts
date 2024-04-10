import { isValidHexCode } from './colorUtils';

describe('colorUtils', () => {
  it('should confirm a valid color hexcode', () => {
    expect(isValidHexCode('#00FF00')).toBeTruthy();
    expect(isValidHexCode('#00ff00')).toBeTruthy();
  });

  it('should detect invalid color hexcode', () => {
    expect(isValidHexCode('00FF00')).toBeFalsy();
    expect(isValidHexCode('0F0')).toBeFalsy();
    expect(isValidHexCode('undefined')).toBeFalsy();
    expect(isValidHexCode('null')).toBeFalsy();
    expect(isValidHexCode('blue')).toBeFalsy();
  });
});
