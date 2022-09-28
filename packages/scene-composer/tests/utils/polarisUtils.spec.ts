import { mapToSelectOption } from '../../src/utils/polarisUtils';

describe('polarisUtils', () => {
  it('should create polaris selectOption when calling mapToSelectOption', () => {
    expect(mapToSelectOption('test')).toEqual({ label: 'test', value: 'test' });
  });
});
