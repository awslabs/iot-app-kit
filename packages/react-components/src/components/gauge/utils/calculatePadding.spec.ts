import { calculatePadding } from './calculatePadding';

describe('calculatePadding', () => {
  it('returns negative padding when fontSize is greater than unitFontSize', () => {
    expect(calculatePadding({ fontSize: 20, unitFontSize: 10 })).toBe(-5);
    expect(calculatePadding({ fontSize: 30, unitFontSize: 10 })).toBe(-10);
  });

  it('returns positive padding when fontSize is less than unitFontSize', () => {
    expect(calculatePadding({ fontSize: 10, unitFontSize: 20 })).toBe(5);
    expect(calculatePadding({ fontSize: 5, unitFontSize: 15 })).toBe(5);
  });

  it('returns 0 when fontSize is equal to unitFontSize', () => {
    expect(calculatePadding({ fontSize: 15, unitFontSize: 15 })).toBe(0);
    expect(calculatePadding({ fontSize: 0, unitFontSize: 0 })).toBe(0);
  });

  it('handles default values when parameters are omitted', () => {
    expect(calculatePadding({})).toBe(0);
    expect(calculatePadding({ fontSize: 10 })).toBe(-5);
    expect(calculatePadding({ unitFontSize: 10 })).toBe(5);
  });
});
