import { getDecimalValueFromMinMax } from './getDecimalValueFromMinMax';

describe('getDecimalValueFromMinMax', () => {
  it('should return 0 when the input value is less than the minimum threshold', () => {
    const result = getDecimalValueFromMinMax({ value: 10, min: 20, max: 30 });
    expect(result).toEqual(0);
  });

  it('should return 1 when the input value is greater than the maximum threshold', () => {
    const result = getDecimalValueFromMinMax({ value: 40, min: 20, max: 30 });
    expect(result).toEqual(1);
  });

  it('should return the correct decimal value when the input value is between the minimum and maximum threshold', () => {
    const result = getDecimalValueFromMinMax({ value: 25, min: 20, max: 30 });
    // Calculation: (25 - 20) / (30 - 20) = 5 / 10 = 0.5
    expect(result).toEqual(0.5);
  });
});
