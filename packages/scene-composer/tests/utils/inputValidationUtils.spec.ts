import { validateRuleId } from '../../src/utils/inputValidationUtils';

describe('validateRuleId', () => {
  ['RuleId-1', 'RuleId-_1', '_RuleId1'].forEach((validCase) => {
    it(`should be valid in format "${validCase}"`, () => {
      expect(validateRuleId(validCase)).toBeTruthy();
    });
  });

  ['RociId 1', '-RuleId1', 'RuleId_'].forEach((invalidCase) => {
    it(`should be invalid when format is "${invalidCase}"`, () => {
      expect(validateRuleId(invalidCase)).toBeFalsy();
    });
  });
});
