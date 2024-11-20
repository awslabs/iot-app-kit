import {
  emToPx,
  perToPx,
  pxToEm,
  pxToPercent,
  pxToRem,
  remToPx,
} from './pxConversion';

describe('px converstion', () => {
  describe('pxToPercent', () => {
    it('should return the correct percentage when px is less than totalPx', () => {
      expect(pxToPercent(10, 100)).toBe(10);
    });

    it('should return the correct percentage when px is equal to totalPx', () => {
      expect(pxToPercent(100, 100)).toBe(100);
    });

    it('should return the correct percentage when px is greater than totalPx', () => {
      expect(pxToPercent(150, 100)).toBe(150);
    });
  });

  describe('perToPx', () => {
    it('should return the correct value when input is a positive number', () => {
      expect(perToPx(100)).toBe(1);
    });

    it('should return the correct value when input is a negative number', () => {
      expect(perToPx(-50)).toBe(-0.5);
    });

    it('should return 0 when input is 0', () => {
      expect(perToPx(0)).toBe(0);
    });
  });

  describe('pxToEm', () => {
    beforeAll(() => {
      vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        return {
          fontSize: '16px',
        } as CSSStyleDeclaration;
      });
    });
    it('converts pixels to ems using the default font-size', () => {
      expect(pxToEm(32)).toBe(2); // 32px / 16px per em = 2em
    });
    it('handles zero pixels', () => {
      expect(pxToEm(0)).toBe(0); // 0px / 16px per em = 0em
    });
    it('handles negative pixels', () => {
      expect(pxToEm(-16)).toBe(-1); // -16px / 16px per em = -1em
    });
    afterAll(() => {
      vi.restoreAllMocks();
    });
  });
  test('emToPx should convert em to px correctly', () => {
    const mockGetComputedStyle = vi.fn().mockReturnValue({ fontSize: '16px' });
    window.getComputedStyle = mockGetComputedStyle;

    expect(emToPx(2)).toBe(32); // 2em * 16px = 32px
  });

  describe('remToPx', () => {
    it('should convert rem to px', () => {
      const remValue = 2;
      const result = remToPx(remValue);

      expect(result).toBe(32);
    });
  });

  describe('pxToRem', () => {
    it('should convert pixels to rems', () => {
      expect(pxToRem(16, 16)).toBe(1);
    });

    it('should handle base parameter', () => {
      expect(pxToRem(32, 8)).toBe(4);
    });
  });
});
