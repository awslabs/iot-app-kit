import { parseValueAndUnit } from './parseValueAndUnit';

describe('parseValueAndUnit', () => {
  it('should parse an input with only a number', () => {
    expect(parseValueAndUnit('100')).toEqual({ value: 100, unit: 'px' });
  });

  it('should parse an input with a number followed by a unit', () => {
    expect(parseValueAndUnit('75%')).toEqual({ value: 75, unit: '%' });
  });

  it('should parse an input with a number followed by a unit', () => {
    expect(parseValueAndUnit('50em')).toEqual({ value: 50, unit: 'em' });
  });

  it('should return 0 for value and px for unit if input is just a string', () => {
    expect(parseValueAndUnit('')).toEqual({ value: 0, unit: 'px' });
  });

  it('should handle input with spaces and mixed units', () => {
    expect(parseValueAndUnit('  200  px ')).toEqual({ value: 200, unit: 'px' });
  });

  it('should default to 0 for value if number is not parseable', () => {
    expect(parseValueAndUnit('px')).toEqual({ value: 0, unit: 'px' });
  });
});
