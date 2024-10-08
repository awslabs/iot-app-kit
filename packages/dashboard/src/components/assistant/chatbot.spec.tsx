import { render, renderHook, waitFor } from '@testing-library/react';
import { Chatbot } from './chatbot';
import { Provider, useDispatch } from 'react-redux';
import React, { ReactNode } from 'react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { DefaultDashboardMessages } from '~/messages';
import userEvent from '@testing-library/user-event';
import { onToggleChatbotAction } from '~/store/actions';

const store = configureDashboardStore({
  ...initialState,
  readOnly: false,
  assistant: {
    ...initialState.assistant,
    state: 'PASSIVE',
    conversationId: 'conversationId',
  },
});
const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Chatbot', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <TestProvider>
        <Chatbot height={0} messageOverrides={DefaultDashboardMessages} />
      </TestProvider>
    );

    expect(getByText('AI Assistant')).toBeInTheDocument();
  });

  it('should close the chatbot', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <TestProvider>
        <Chatbot height={0} messageOverrides={DefaultDashboardMessages} />
      </TestProvider>
    );

    expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Close' }));

    expect(store.getState().assistant.isChatbotOpen).toBeFalsy();
  });

  it('should clean assistant state and create a new conversationId when reset button is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <TestProvider>
        <Chatbot height={0} messageOverrides={DefaultDashboardMessages} />
      </TestProvider>
    );

    const initialConversationID = store.getState().assistant.conversationId;
    expect(getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Reset' }));

    expect(store.getState().assistant.conversationId).not.toEqual(
      initialConversationID
    );
    expect(store.getState().assistant.callerComponentId).not.toBeDefined();
    expect(store.getState().assistant.action).not.toBeDefined();
    expect(store.getState().assistant.selectedQueries).toEqual([]);
  });

  it('should open chatbot when summarization is requested from widget', async () => {
    render(
      <TestProvider>
        <Chatbot height={0} messageOverrides={DefaultDashboardMessages} />
      </TestProvider>
    );

    renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(
          onToggleChatbotAction({
            open: true,
            callerComponentId: 'sourceComponentId',
            action: 'summarize',
          })
        );
      },
      { wrapper: TestProvider }
    );

    await waitFor(() => {
      expect(store.getState().assistant.isChatbotOpen).toEqual(true);
      expect(store.getState().assistant.callerComponentId).toEqual(
        'sourceComponentId'
      );
    });
  });

  it('should open chatbot when summarization is requested within the dashboard', async () => {
    render(
      <TestProvider>
        <Chatbot height={0} messageOverrides={DefaultDashboardMessages} />
      </TestProvider>
    );

    renderHook(
      () => {
        const dispatch = useDispatch();
        dispatch(
          onToggleChatbotAction({
            open: true,
            callerComponentId: 'dashboard',
            action: 'summarize',
          })
        );
      },
      { wrapper: TestProvider }
    );

    await waitFor(() => {
      expect(store.getState().assistant.isChatbotOpen).toEqual(true);
      expect(store.getState().assistant.callerComponentId).toEqual('dashboard');
    });
  });
});
