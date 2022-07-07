import { validateRuleId } from '../../src/utils/inputValidationUtils';

describe('validateRuleId', () => {
  it('should be valid', () => {
    expect(validateRuleId('RuleId-1')).toBeTruthy();
  });
  it('should be invalid with whitespaces', () => {
    expect(validateRuleId('RociId 1')).toBeFalsy();
  });
  it('should be valid', () => {
    expect(validateRuleId('RuleId-_1')).toBeTruthy();
  });
  it('should be valid', () => {
    expect(validateRuleId('_RuleId1')).toBeTruthy();
  });
  it('should be invalid with hyphen at the begining', () => {
    expect(validateRuleId('-RuleId1')).toBeFalsy();
  });
  it('should be invalid with special character at the end', () => {
    expect(validateRuleId('RuleId_')).toBeFalsy();
  });
});
