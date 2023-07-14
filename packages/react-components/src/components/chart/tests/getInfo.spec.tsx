import { describe, expect } from '@jest/globals';
import { setXWithBounds } from '../utils/getInfo';

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
});
