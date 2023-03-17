import React from 'react';
import { Provider } from 'react-redux';

import wrapper from '@cloudscape-design/components/test-utils/dom';

import { act } from '@testing-library/react';

import { screen } from '@testing-library/dom';

import ViewportSelection from './index';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import { createRoot } from 'react-dom/client';

const LAST_MINUTE = 0;
const CUSTOM = 9;
/**
 * expandToViewport uses portals which causes makes it difficult for the test to find the correct buttons
 * it is enabled by default for correct styling.
 */
const TestComponent = () => {
  const args = {
    dashboardConfiguration: {
      widgets: [],
      viewport: { duration: '5m' },
    },
  };
  return (
    <Provider store={configureDashboardStore(args)}>
      <ViewportSelection expandToViewport={false} messageOverrides={DefaultDashboardMessages} />;
    </Provider>
  );
};

describe('ViewportSelection', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);

    act(() => {
      root.render(<TestComponent />);
    });

    expect(screen.getByText('Last 5 minutes')).toBeTruthy();
  });

  it('can select a relative duration', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);

    act(() => {
      root.render(<TestComponent />);
    });

    const viewportSelection = container.querySelector('.viewport-selection');
    if (!viewportSelection) throw new Error('viewport did not render');
    const dateRangePicker = wrapper(viewportSelection).findDateRangePicker();

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

    expect(screen.getByText('Last minute')).toBeTruthy();
  });

  it('can select a relative custom duration', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    document.body.style.height = '10000px';
    document.body.style.width = '10000px';

    const root = createRoot(container);

    act(() => {
      root.render(<TestComponent />);
    });

    const viewportSelection = container.querySelector('.viewport-selection');
    if (!viewportSelection) throw new Error('viewport did not render');
    const dateRangePicker = wrapper(viewportSelection).findDateRangePicker();

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

    expect(screen.getByText('Last 15 minutes')).toBeTruthy();
  });
});
