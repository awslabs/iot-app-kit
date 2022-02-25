import { isDefined } from './predicates';

describe('isDefined', () => {
  it('returns false when passed null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('returns false when passed undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('returns true when passed 0', () => {
    expect(isDefined(0)).toBe(true);
  });

  it('returns true when passed NaN', () => {
    expect(isDefined(NaN)).toBe(true);
  });

  it('returns true when passed an object', () => {
    expect(isDefined({})).toBe(true);
  });
});
