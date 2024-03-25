import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { getByLabelText, render, screen } from '@testing-library/react';
import React from 'react';
import type { DashboardState } from '~/store/state';
import { FormatDataConfiguration } from './index';
import userEvent from '@testing-library/user-event';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_LINE_CHART_WIDGET],
  },
  selectedWidgets: [MOCK_LINE_CHART_WIDGET],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <FormatDataConfiguration />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders the decimal places input', async () => {
  const elem = render(<TestComponent />).baseElement;
  expect(getByLabelText(elem, 'Decimal places')).toBeTruthy();
});

it('shows error if decimal places input is greater than 100', async () => {
  const user = userEvent.setup();
  render(<TestComponent />);
  const input = screen.getByLabelText('Decimal places');
  await user.type(input, '123');
  const errorText = screen.getByText(
    'Decimal places must be between 0 and 100.'
  );
  expect(errorText).toBeTruthy();
});
