import { nonNegative } from './number';

it('should return the non-negative value when given a positive number', () => {
  expect(nonNegative(5)).toBe(5);
});

it('should return 0 when given 0', () => {
  expect(nonNegative(0)).toBe(0);
});

it('should return 0 when given a negative number', () => {
  expect(nonNegative(-10)).toBe(0);
});
