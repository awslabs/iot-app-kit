import { describe, expect } from '@jest/globals';
import { calculateXFromTimestamp, calculateYMaxMin, setXWithBounds } from '../utils/getInfo';
import { mockSeries } from './getTrendCursor.spec';

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
    const mockViewport = {
      start: new Date('2023-07-13T16:00:00.000Z'),
      end: new Date('2023-07-13T16:30:00.000Z'),
    };

    it('should return new x for a given timestamp', () => {
      const maxX = calculateXFromTimestamp(1689265200000, mockSize, mockViewport);

      expect(Number(maxX.toPrecision(2))).toBe(320);
    });
  });

  describe('calculateYMaxMin', () => {
    it('should return new x for a given timestamp', () => {
      const { yMax, yMin } = calculateYMaxMin(mockSeries);

      expect(yMax).toBe(30);
      expect(yMin).toBe(0);
    });
  });
});
