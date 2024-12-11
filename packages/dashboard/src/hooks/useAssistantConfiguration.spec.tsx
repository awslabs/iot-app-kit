import type { AssistantActionEventDetail } from '@iot-app-kit/react-components';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider, useDispatch } from 'react-redux';
import { configureDashboardStore } from '../store/index-old';
import { onToggleReadOnly } from '../store/actions';
import { initialState } from '../store/state-old';
import { useAssistantConfiguration } from './useAssistantConfiguration';

const store = configureDashboardStore(initialState);
const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={store}>{children}</Provider>;
const widgetId = 'widgetId';

describe('useAssistantConfiguration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return assistant property when dashboard mode is readonly', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(onToggleReadOnly());
        return useAssistantConfiguration(widgetId);
      },
      { wrapper: TestProvider }
    );

    const { assistantConfiguration: assistant } = result.current;
    expect(assistant).toBeDefined();
    expect(assistant?.conversationId).toEqual(expect.any(String));
    expect(assistant?.target).toBe('dashboard');
    expect(assistant?.onAction).toEqual(expect.any(Function));
  });

  it('should NOT return assistant property when dashboard mode is NOT readonly', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(onToggleReadOnly());
        return useAssistantConfiguration(widgetId);
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
        return useAssistantConfiguration(widgetId);
      },
      { wrapper: TestProvider }
    );

    act(() => {
      if (result.current.assistantConfiguration?.onAction) {
        result.current.assistantConfiguration.onAction({
          type: 'divedeep',
          sourceComponentId: 'sourceComponentId',
          sourceComponentType: 'kpi',
        } satisfies AssistantActionEventDetail);
      }
    });

    await waitFor(() => {
      expect(store.getState().assistant.isChatbotOpen).toEqual(true);
    });
  });

  it('should save summarize action on state when callback action is summarize', async () => {
    const { result } = renderHook(
      () => {
        return useAssistantConfiguration(widgetId);
      },
      { wrapper: TestProvider }
    );

    expect(result.current?.assistantConfiguration?.onAction).toBeDefined();

    act(() => {
      if (result.current?.assistantConfiguration?.onAction) {
        result.current?.assistantConfiguration?.onAction({
          type: 'summarize',
          sourceComponentId: 'sourceComponentId',
          sourceComponentType: 'kpi',
        } satisfies AssistantActionEventDetail);
      }
    });

    await waitFor(() => {
      expect(store.getState().assistant.action).toEqual('summarize');
    });
  });

  it('should save selectedQueries on state when callback action is selection', async () => {
    const { result } = renderHook(
      () => {
        return useAssistantConfiguration(widgetId);
      },
      { wrapper: TestProvider }
    );

    expect(result.current?.assistantConfiguration?.onAction).toBeDefined();

    act(() => {
      if (result.current?.assistantConfiguration?.onAction) {
        result.current?.assistantConfiguration?.onAction({
          type: 'selection',
          sourceComponentId: 'sourceComponentId',
          sourceComponentType: 'kpi',
          selectedProperties: 2,
        } satisfies AssistantActionEventDetail);
      }
    });

    await waitFor(() => {
      expect(store.getState().assistant.selectedQueries[0].widgetId).toEqual(
        'sourceComponentId'
      );
      expect(store.getState().assistant.selectedQueries[0].widgetType).toEqual(
        'kpi'
      );
      expect(
        store.getState().assistant.selectedQueries[0].selectedProperties
      ).toEqual(2);
    });
  });
});
