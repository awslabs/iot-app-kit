import { getPreciseValue } from './getPreciseValue';

describe('getPreciseValue', () => {
  it('should return a string with default significant digits for numeric input', () => {
    expect(getPreciseValue(1234.56789)).toBe('1234.5679');
  });

  it('should return a string with custom significant digits for numeric input', () => {
    expect(getPreciseValue(1234.56789, 2)).toBe('1234.57');
  });

  it('should return the input value as a string for non-numeric input', () => {
    expect(getPreciseValue('abc')).toBe('abc');
  });
});
