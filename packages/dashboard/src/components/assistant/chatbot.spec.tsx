import { render } from '@testing-library/react';
import { Chatbot } from './chatbot';
import { Provider } from 'react-redux';
import React, { ReactNode } from 'react';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { DefaultDashboardMessages } from '~/messages';

const store = configureDashboardStore(initialState);
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
});
