import React, { ReactNode } from 'react';
import { useAssistant } from './useAssistant';
import { renderHook, waitFor } from '@testing-library/react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { onToggleReadOnly } from '~/store/actions';
import { Provider, useDispatch } from 'react-redux';
import { MessageType, type IMessage } from '@iot-app-kit/react-components';

const store = configureDashboardStore(initialState);
const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={store}>{children}</Provider>;
const widgetId = 'widgetId';

describe('useAssistant', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return assistant property when dashboard mode is readonly', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(onToggleReadOnly());
        return useAssistant(widgetId);
      },
      { wrapper: TestProvider }
    );

    const { assistantConfiguration: assistant } = result.current;
    expect(assistant).toBeDefined();
    expect(assistant?.enabled).toBeTruthy();
    expect(assistant?.conversationId).toEqual(expect.any(String));
    expect(assistant?.target).toBe('dashboard');
    expect(assistant?.onAction).toEqual(expect.any(Function));
  });

  it('should NOT return assistant property when dashboard mode is NOT readonly', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(onToggleReadOnly());
        return useAssistant(widgetId);
      },
      { wrapper: TestProvider }
    );

    expect(result.current.assistantConfiguration).not.toBeDefined();
  });

  it('should open Chatbot when divedeep action is triggered', async () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        if (!store.getState().readOnly) {
          dispatch(onToggleReadOnly());
        }
        return useAssistant(widgetId);
      },
      { wrapper: TestProvider }
    );

    const expectedContent =
      'Hello, I am your dashboard assistant, please ask me anything about your dashboard.';
    const messages = [
      {
        content: expectedContent,
        sender: 'assistant',
        type: MessageType.TEXT,
        id: 'messageId',
        loading: false,
      } satisfies IMessage,
    ];

    if (result.current.assistantConfiguration?.onAction) {
      result.current.assistantConfiguration.onAction({
        type: 'divedeep',
        sourceComponentId: 'sourceComponentId',
        messages,
      });
    }

    await waitFor(() => {
      const [first] = store.getState().assistant.messages;
      expect(first.content).toBe(expectedContent);
    });
  });
});
