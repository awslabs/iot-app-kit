import { isDefined, isNumber } from './predicates';

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

describe('isNumber', () => {
  describe.each`
    value         | expected
    ${''}         | ${false}
    ${new Date()} | ${false}
    ${123}        | ${true}
    ${true}       | ${false}
    ${'TEST'}     | ${false}
    ${'123'}      | ${false}
    ${123.3}      | ${true}
    ${NaN}        | ${true}
    ${12e3}       | ${true}
  `('checks if value is a number', ({ value, expected }) => {
    test(`${value}) is  ${expected ? '' : 'not '}a number`, () => {
      expect(isNumber(value)).toBe(expected);
    });
  });
});
