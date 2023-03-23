import React from 'react';
import { Provider } from 'react-redux';

import wrapper from '@cloudscape-design/components/test-utils/dom';

import { act, render } from '@testing-library/react';

import { screen } from '@testing-library/dom';

import ViewportSelection from './index';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';

const LAST_MINUTE = 0;
const CUSTOM = 9;

describe('ViewportSelection', () => {
  it('should render', function () {
    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [],
            viewport: { duration: '5m' },
          },
        })}
      >
        <ViewportSelection expandToViewport={false} messageOverrides={DefaultDashboardMessages} />;
      </Provider>
    );

    expect(screen.getByText('Last 5 minutes')).toBeInTheDocument();
  });

  it('can select a relative duration', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [],
            viewport: { duration: '5m' },
          },
        })}
      >
        <ViewportSelection expandToViewport={false} messageOverrides={DefaultDashboardMessages} />;
      </Provider>
    );

    const dateRangePicker = wrapper(container).findDateRangePicker();

    act(() => {
      dateRangePicker?.openDropdown();
    });

    act(() => {
      const dropdown = dateRangePicker?.findDropdown();
      const group = dropdown?.findRelativeRangeRadioGroup();
      const button = group?.findButtons()[LAST_MINUTE];
      button?.findNativeInput()?.click();
    });

    act(() => {
      dateRangePicker?.findDropdown()?.findApplyButton().click();
    });

    expect(screen.getByText('Last minute')).toBeInTheDocument();
  });

  it('can select a relative custom duration', function () {
    const { container } = render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [],
            viewport: { duration: '5m' },
          },
        })}
      >
        <ViewportSelection expandToViewport={false} messageOverrides={DefaultDashboardMessages} />;
      </Provider>
    );

    const dateRangePicker = wrapper(container).findDateRangePicker();

    act(() => {
      dateRangePicker?.openDropdown();
    });

    act(() => {
      const dropdown = dateRangePicker?.findDropdown();
      const group = dropdown?.findRelativeRangeRadioGroup();
      const button = group?.findButtons()[CUSTOM];
      button?.findNativeInput()?.click();
    });

    act(() => {
      const rangeInput = dateRangePicker?.findDropdown()?.findCustomRelativeRangeDuration();
      rangeInput?.setInputValue('15');
    });

    act(() => {
      dateRangePicker?.findDropdown()?.findApplyButton().click();
    });

    expect(screen.getByText('Last 15 minutes')).toBeInTheDocument();
  });
});
