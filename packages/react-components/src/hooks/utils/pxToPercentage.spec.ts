import { pxToPercent } from './pxToPercentage'; // Replace './file' with the correct path to the file containing the pxToPercent function

describe('pxToPercent', () => {
  it('should return the correct percentage when px is less than totalPx', () => {
    expect(pxToPercent(10, 100)).toBe('10%');
  });

  it('should return the correct percentage when px is equal to totalPx', () => {
    expect(pxToPercent(100, 100)).toBe('100%');
  });

  it('should return the correct percentage when px is greater than totalPx', () => {
    expect(pxToPercent(150, 100)).toBe('150%');
  });
});
