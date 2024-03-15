import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefreshRateDropDown } from './refreshRateDropdown';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';

describe('Refresh rate drop down', () => {
  const ProviderWrapper = ({ children }: PropsWithChildren) => (
    <Provider store={configureDashboardStore()}>{children}</Provider>
  );

  it('selecting option changes on screen', async () => {
    const dropDownElement = <RefreshRateDropDown />;
    const user = userEvent.setup();
    render(dropDownElement, { wrapper: ProviderWrapper });
    const dropDown = screen.getByLabelText('Refresh rate');
    expect(screen.queryByText('1s')).not.toBeInTheDocument();
    expect(screen.getByText('5s')).toBeVisible();
    await user.click(dropDown);
    const oneSecondOption = screen.getByText('1s');
    await user.click(oneSecondOption);
    expect(screen.queryByText('5s')).not.toBeInTheDocument();
    expect(screen.getByText('1s')).toBeVisible();
  });

  it('all options are visible on dropdown click', async () => {
    const dropDownElement = <RefreshRateDropDown />;
    const user = userEvent.setup();
    render(dropDownElement, { wrapper: ProviderWrapper });
    const dropDown = screen.getByLabelText('Refresh rate');
    await user.click(dropDown);
    expect(screen.getByText('1s')).toBeVisible();
    const fiveSecondOptions = screen.getAllByText('5s');
    fiveSecondOptions.forEach((option) => expect(option).toBeVisible()); //default option + dropdown option
    expect(screen.getByText('10s')).toBeVisible();
    expect(screen.getByText('1m')).toBeVisible();
    expect(screen.getByText('5m')).toBeVisible();
  });

  it('triggers modal when 1s option is selected', async () => {
    const dropDownElement = <RefreshRateDropDown />;
    const user = userEvent.setup();
    render(dropDownElement, { wrapper: ProviderWrapper });
    expect(screen.getByText('5s')).toBeVisible();
    const dropDown = screen.getByLabelText('Refresh rate');
    await user.click(dropDown);
    const oneSecondOption = screen.getByText('1s');
    await user.click(oneSecondOption);
    expect(
      screen.getByText(
        'You may experience some lag by selecting the 1 second refresh rate.'
      )
    ).toBeVisible();
  });
});
