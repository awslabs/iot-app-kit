import { renderHook } from '@testing-library/react';

import { accessStore } from '../store';

import useRuleResult from './useRuleResult';

jest.mock('./useBindingData', () =>
  jest.fn().mockImplementation((param) => (param ? { data: [{ alarm_status: 'ACTIVE' }] } : { data: undefined })),
);

describe('useRuleResult', () => {
  beforeEach(() => {
    accessStore('default').setState({
      getSceneRuleMapById: jest.fn().mockImplementation((id) =>
        id == 'rule-id'
          ? {
              statements: [
                {
                  expression: "alarm_status == 'ACTIVE'",
                  target: 'iottwinmaker.common.icon:Error',
                },
              ],
            }
          : undefined,
      ),
    });
  });

  it('should return default when binding is empty', () => {
    const data = renderHook(() => useRuleResult({ ruleMapId: 'rule-id', defaultValue: 'default' })).result.current;

    expect(data).toEqual({ target: 'default', targetMetadata: undefined });
  });

  it('should return default when rule is not found', () => {
    const data = renderHook(() =>
      useRuleResult({
        ruleMapId: 'rule-id-random',
        defaultValue: 'default',
        dataBinding: { dataBindingContext: { entityId: 'entity-id' } },
      }),
    ).result.current;

    expect(data).toEqual({ target: 'default', targetMetadata: undefined });
  });

  it('should return expected target value ', () => {
    const expectedData = { target: 'iottwinmaker.common.icon:Error', targetMetadata: undefined };
    const data = renderHook(() =>
      useRuleResult({
        ruleMapId: 'rule-id',
        defaultValue: 'default',
        dataBinding: { dataBindingContext: { entityId: 'entity-id' } },
      }),
    ).result.current;

    expect(data).toEqual(expectedData);
  });
});
