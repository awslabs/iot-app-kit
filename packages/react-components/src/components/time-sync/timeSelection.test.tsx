import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render, screen } from '@testing-library/react';
import { TimeSync } from '.';
import { TimeSelection } from './timeSelection';

const LAST_MINUTE = 0;
const CUSTOM = 9;

const renderViewport = ({ hideTitle }: { hideTitle?: boolean } = {}) =>
  render(
    <TimeSync group='test-group' initialViewport={{ duration: '5m' }}>
      <TimeSelection hideTitle={hideTitle} />;
    </TimeSync>
  );

describe('TimeSelection', () => {
  it('should render', function () {
    renderViewport();

    expect(screen.getByText('Last 5 minutes')).toBeInTheDocument();
  });

  it('can select a relative duration', function () {
    const { container } = renderViewport();

    const dateRangePicker = wrapper(container).findDateRangePicker();

    act(() => {
      dateRangePicker?.openDropdown();
    });

    const dateRangePickerDropdown = dateRangePicker?.findDropdown({
      expandToViewport: true,
    });

    act(() => {
      const group = dateRangePickerDropdown?.findRelativeRangeRadioGroup();
      const button = group?.findButtons()[LAST_MINUTE];
      button?.findNativeInput()?.click();
    });

    act(() => {
      dateRangePickerDropdown?.findApplyButton().click();
    });

    expect(screen.getByText('Last minute')).toBeInTheDocument();
  });

  it('can select a relative custom duration', function () {
    const { container } = renderViewport();

    const dateRangePicker = wrapper(container).findDateRangePicker();

    act(() => {
      dateRangePicker?.openDropdown();
    });

    const dateRangePickerDropdown = dateRangePicker?.findDropdown({
      expandToViewport: true,
    });

    act(() => {
      const group = dateRangePickerDropdown?.findRelativeRangeRadioGroup();
      const button = group?.findButtons()[CUSTOM];
      button?.findNativeInput()?.click();
    });

    act(() => {
      const rangeInput =
        dateRangePickerDropdown?.findCustomRelativeRangeDuration();
      rangeInput?.setInputValue('15');
    });

    act(() => {
      dateRangePickerDropdown?.findApplyButton().click();
    });

    expect(screen.getByText('Last 15 minutes')).toBeInTheDocument();
  });

  test('title is hidden when hideTitle is true', () => {
    const { queryByText } = renderViewport({ hideTitle: true });
    const label = queryByText('Time range');
    expect(label).toBeNull();
  });

  test('title is visible when hideTitle is false', () => {
    const { queryByText } = renderViewport({ hideTitle: false });
    const label = queryByText('Time range');
    expect(label).toBeVisible();
  });
});
