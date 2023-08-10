import { describe, expect } from '@jest/globals';
import { calculateXFromTimestamp, setXWithBounds } from '../utils/getInfo';
import { mockViewportInMs } from './getTrendCursor.spec';

describe('Testing Charts getInfo', () => {
  const mockSize = { width: 500, height: 500 };

  describe('setXWithBounds', () => {
    it('should return max of width minus margin', () => {
      const maxX = setXWithBounds(mockSize, 475);

      expect(maxX).toBe(450);
    });

    it('should return min of margin', () => {
      const maxX = setXWithBounds(mockSize, 20);

      expect(maxX).toBe(50);
    });
  });

  describe('calculateXFromTimestamp', () => {
    it('should return new x for a given timestamp', () => {
      const maxX = calculateXFromTimestamp(1689265200000, mockSize, mockViewportInMs);

      expect(Number(maxX.toPrecision(2))).toBe(320);
    });
  });
});
