import { pascalCase, toNumber, evalStringTemplate } from '../../src/utils/stringUtils';

describe('pascalCase', () => {
  it('should convert camelCase to PascalCase', () => {
    const result = pascalCase('modelRef');
    expect(result).toBe('ModelRef');
  });

  it('should keep PascalCase as PascalCase', () => {
    const result = pascalCase('ModelRef');
    expect(result).toBe('ModelRef');
  });

  it('should handle empty string', () => {
    const result = pascalCase('');
    expect(result).toBe('');
  });
});

describe('toNumber', () => {
  it('should convert "1" to 1', () => {
    expect(toNumber('1')).toBe(1);
  });

  it('should convert "a" to default value 0', () => {
    expect(toNumber('a')).toBe(0);
  });

  it('should convert "a" to custom default value 2', () => {
    expect(toNumber('a', 2)).toBe(2);
  });
});

describe('evalStringTemplate', () => {
  it('should produce original string if params is empty', () => {
    expect(evalStringTemplate('test')).toBe('test');
    expect(evalStringTemplate('test', {})).toBe('test');
  });

  it('should replace template var with the correct value', () => {
    expect(
      evalStringTemplate('{{test}}{{foo}}aaa{{bar}}bbb{{bar}}{{test}}', {
        test: 'test',
        foo: 'oof',
        bar: 'baz',
      }),
    ).toBe('testoofaaabazbbbbaztest');
  });

  it('should replace template var with empty string if not available in the params', () => {
    expect(
      evalStringTemplate('{{test}}{{foo}}aaa{{bar}}bbb{{bar}}{{test}}', {
        test: 'test',
        foo: 'oof',
      }),
    ).toBe('testoofaaabbbtest');
  });

  it('should not replace single curry brace', () => {
    expect(
      evalStringTemplate('{{{test}}', {
        test: 'test',
        foo: 'oof',
      }),
    ).toBe('{test');
  });
});
