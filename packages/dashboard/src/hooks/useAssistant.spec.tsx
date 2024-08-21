import React, { ReactNode } from 'react';
import { useAssistant } from './useAssistant';
import { renderHook } from '@testing-library/react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { onToggleReadOnly } from '~/store/actions';
import { Provider, useDispatch } from 'react-redux';

const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => (
  <Provider store={configureDashboardStore(initialState)}>{children}</Provider>
);

describe('useAssistant', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return assistant property when dashboard mode is readonly', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(onToggleReadOnly());
        return useAssistant();
      },
      { wrapper: TestProvider }
    );

    expect(
      result.current.assistantProperties.assistant?.conversationID
    ).toBeDefined();
  });

  it('should NOT return assistant property when dashboard mode is NOT readonly', () => {
    const { result } = renderHook(
      () => {
        return useAssistant();
      },
      { wrapper: TestProvider }
    );

    expect(result.current.assistantProperties.assistant).not.toBeDefined();
  });
});
