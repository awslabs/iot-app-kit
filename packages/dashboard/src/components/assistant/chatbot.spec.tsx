import { render } from '@testing-library/react';
import { Chatbot } from './chatbot';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React, { ReactNode } from 'react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';

const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => (
  <Provider store={configureDashboardStore(initialState)}>{children}</Provider>
);

describe('Chatbot', () => {
  test('renders correctly', () => {
    const { getByAltText } = render(
      <TestProvider>
        <Chatbot height={0} top={0} />
      </TestProvider>
    );

    expect(getByAltText('Assistant Icon')).toBeInTheDocument();
  });

  test('should open chat correctly', async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(
      <TestProvider>
        <Chatbot height={0} top={0} />
      </TestProvider>
    );

    expect(getByRole('button', { name: 'Assistant Icon' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Assistant Icon' }));
    expect(getByText('Sitewise Assistant')).toBeVisible();
  });

  test('should close chat correctly', async () => {
    const user = userEvent.setup();
    const { getByTestId, getByText, getByRole } = render(
      <TestProvider>
        <Chatbot height={0} top={0} />
      </TestProvider>
    );

    expect(getByRole('button', { name: 'Assistant Icon' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Assistant Icon' }));
    expect(getByText('Sitewise Assistant')).toBeVisible();

    expect(getByTestId('assistant-chatbot-close-button')).not.toBeNull();
    await user.click(getByTestId('assistant-chatbot-close-button'));
    expect(getByRole('button', { name: 'Assistant Icon' })).toBeVisible();
  });
});
