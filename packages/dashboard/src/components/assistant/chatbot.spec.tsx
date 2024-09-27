import { render, renderHook, waitFor } from '@testing-library/react';
import { Chatbot } from './chatbot';
import userEvent from '@testing-library/user-event';
import { Provider, useDispatch } from 'react-redux';
import React, { ReactNode } from 'react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { onToggleReadOnly, onToggleChatbotAction } from '~/store/actions';

const store = configureDashboardStore(initialState);
const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Chatbot', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <TestProvider>
        <Chatbot height={0} />
      </TestProvider>
    );

    expect(getByTestId('dashboard-chatbot')).toBeInTheDocument();
  });

  it('should open chat correctly', async () => {
    const { getByText } = render(
      <TestProvider>
        <Chatbot height={0} />
      </TestProvider>
    );

    renderHook(
      () => {
        const dispatch = useDispatch();
        if (!store.getState().readOnly) {
          dispatch(onToggleReadOnly());
        }
        dispatch(
          onToggleChatbotAction({
            open: true,
            componentId: 'componentId',
            messages: [],
          })
        );
      },
      { wrapper: TestProvider }
    );

    expect(getByText('Sitewise Assistant')).toBeVisible();
  });

  it('should close chat correctly', async () => {
    const user = userEvent.setup();
    const { getByTestId, getByText } = render(
      <TestProvider>
        <Chatbot height={0} />
      </TestProvider>
    );

    renderHook(
      () => {
        const dispatch = useDispatch();
        if (!store.getState().readOnly) {
          dispatch(onToggleReadOnly());
        }
        if (!store.getState().assistant.isChatbotOpen) {
          dispatch(
            onToggleChatbotAction({
              open: true,
              componentId: 'componentId',
              messages: [],
            })
          );
        }
      },
      { wrapper: TestProvider }
    );
    expect(getByText('Sitewise Assistant')).toBeVisible();

    expect(getByTestId('assistant-chatbot-close-button')).not.toBeNull();
    await user.click(getByTestId('assistant-chatbot-close-button'));
    await waitFor(() => {
      expect(store.getState().assistant.isChatbotOpen).toBeFalsy();
    });
  });
});
