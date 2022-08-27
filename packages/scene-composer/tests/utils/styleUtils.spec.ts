import { hexColorFromDesignToken } from '../../src/utils/styleUtils';

describe('hexColorFromDesignToken', () => {
  it('should match', () => {
    const result = hexColorFromDesignToken('var(1, #2)');
    expect(result).toBe('#2');
  });

  it('should fail to match', () => {
    const result = hexColorFromDesignToken('random');
    expect(result).toBe('#000000');
  });
});
