import { replaceBindingVariables } from './dataBindingVariableUtils';

describe('replaceBindingVariables', () => {
  const bindingValuesMap: Record<string, string> = {
    'binding a': '11',
    'binding~!@#$%^&*()': '22',
    '<随机>': '33',
  };

  it('should replace variable with value correctly', () => {
    const original = 'abc ${binding a} def,.';
    const expected = 'abc 11 def,.';

    const result = replaceBindingVariables(original, bindingValuesMap);
    expect(result).toEqual(expected);
  });

  it('should replace variable containing special character with value correctly', () => {
    const original = 'abc ${binding~!@#$%^&*()} def,.';
    const expected = 'abc 22 def,.';

    const result = replaceBindingVariables(original, bindingValuesMap);
    expect(result).toEqual(expected);
  });

  it('should replace variable in other language with value correctly', () => {
    const original = 'abc ${<随机>} def,.';
    const expected = 'abc 33 def,.';

    const result = replaceBindingVariables(original, bindingValuesMap);
    expect(result).toEqual(expected);
  });

  it('should replace all variables with value correctly', () => {
    const original = 'abc ${binding a} and ${binding a} and ${binding~!@#$%^&*()} or ${<随机>} def,.';
    const expected = 'abc 11 and 11 and 22 or 33 def,.';

    const result = replaceBindingVariables(original, bindingValuesMap);
    expect(result).toEqual(expected);
  });

  it('should replace variable with no data when value is not available', () => {
    const original = 'abc ${binding randon} def,.';
    const expected = 'abc - def,.';

    const result = replaceBindingVariables(original, bindingValuesMap);
    expect(result).toEqual(expected);
  });
});
