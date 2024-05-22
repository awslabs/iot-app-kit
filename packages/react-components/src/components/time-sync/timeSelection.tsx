import React from 'react';

import Button from '@cloudscape-design/components/button';
import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import FormField from '@cloudscape-design/components/form-field';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { DateRangePickerProps } from '@cloudscape-design/components/date-range-picker';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';

// import { rangeValidator } from './rangeValidator';
import { useViewport } from '../../hooks/useViewport';
import { Tooltip } from '../tooltip/index';
import {
  dateRangeToViewport,
  getViewportDateRelativeToAbsolute,
  relativeViewportOptions,
  viewportToDateRange,
  rangeValidator,
} from '@iot-app-kit/core-util';

export type ViewportMessages = DateRangePickerProps.I18nStrings & {
  title: string;
  placeholder: string;
  dateRangeIncompleteError: string;
  dateRangeInvalidError: string;
};
const messages: ViewportMessages = {
  title: 'Time range',
  placeholder: 'Dashboard time range',
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next month',
  previousMonthAriaLabel: 'Previous month',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  dateTimeConstraintText:
    'For date, use YYYY/MM/DD. For time, use 24 hr format.',
  relativeModeTitle: 'Relative range',
  absoluteModeTitle: 'Absolute range',
  relativeRangeSelectionHeading: 'Choose a range',
  startDateLabel: 'Start date',
  endDateLabel: 'End date',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  clearButtonLabel: 'Clear and dismiss',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  formatRelativeRange: (e) =>
    e.amount === 1 ? `Last ${e.unit}` : `Last ${e.amount} ${e.unit}s`,
  formatUnit: (e, n) => (1 === n ? e : `${e}s`),
  dateRangeIncompleteError:
    'The selected date range is incomplete. Select a start and end date for the date range.',
  dateRangeInvalidError:
    'The selected date range is invalid. The start date must be before the end date.',
};

/**
 * Component for visualizing and updating the viewport.
 * This component works with the <TimeSync /> component
 * and must be used as a child component of <TimeSync />
 *
 * This component will modify the viewport of the closest
 * parent TimeSync and affect all other viewports in
 * that TimeSync group.
 */
export const TimeSelection = ({
  isPaginationEnabled,
  hideTitle,
}: {
  isPaginationEnabled?: boolean;
  hideTitle?: boolean;
}) => {
  const { viewport, setViewport } = useViewport();

  const handleChangeDateRange: NonCancelableEventHandler<
    DateRangePickerProps.ChangeDetail
  > = (event) => {
    const { value } = event.detail;
    if (!value) return;
    setViewport(dateRangeToViewport(value), 'date-picker');
  };

  const handlePaginateForward = () => {
    const value = viewportToDateRange(viewport);
    if (!value) return;
    if (value.type === 'absolute') {
      const duration =
        new Date(value.endDate).getTime() - new Date(value.startDate).getTime();
      const newEnd = new Date(new Date(value.endDate).getTime() + duration);
      setViewport(
        dateRangeToViewport({
          startDate: value.endDate,
          endDate: newEnd.toISOString(),
          type: value.type,
        }),
        'date-picker'
      );
    }
    if (value.type === 'relative') {
      const newStart = new Date();
      const newEnd = getViewportDateRelativeToAbsolute(value, false, true);
      setViewport(
        dateRangeToViewport({
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString(),
          type: 'absolute',
        }),
        'date-picker'
      );
    }
  };

  const handlePaginateBackward = () => {
    const value = viewportToDateRange(viewport);
    if (!value) return;
    if (value.type === 'absolute') {
      const duration =
        new Date(value.endDate).getTime() - new Date(value.startDate).getTime();
      const newStart = new Date(new Date(value.startDate).getTime() - duration);
      setViewport(
        dateRangeToViewport({
          startDate: newStart.toISOString(),
          endDate: value.startDate,
          type: value.type,
        }),
        'date-picker'
      );
    } else if (value.type === 'relative') {
      const newEnd = getViewportDateRelativeToAbsolute(value);
      const newStart = getViewportDateRelativeToAbsolute(value, true);
      setViewport(
        dateRangeToViewport({
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString(),
          type: 'absolute',
        }),
        'date-picker'
      );
    }
  };

  const {
    title,
    placeholder,
    dateRangeIncompleteError,
    dateRangeInvalidError,
    ...i18nStrings
  } = messages;

  return (
    <div
      aria-label='viewport picker'
      //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <SpaceBetween direction='horizontal' size='xxs' alignItems='end'>
        {isPaginationEnabled && (
          <Tooltip
            content={`Move back ${
              viewport && 'duration' in viewport
                ? viewport.duration
                : 'selected range'
            }`}
            position='bottom'
            children={
              <Button
                iconName='caret-left-filled'
                onClick={handlePaginateBackward}
                ariaLabel='Move backward'
              />
            }
          />
        )}
        <FormField label={!hideTitle ? title : ''} data-testid='time-selection'>
          <DateRangePicker
            expandToViewport={true}
            onChange={handleChangeDateRange}
            value={viewportToDateRange(viewport)}
            showClearButton={false}
            relativeOptions={relativeViewportOptions}
            isValidRange={rangeValidator({
              dateRangeIncompleteError,
              dateRangeInvalidError,
            })}
            i18nStrings={i18nStrings}
            placeholder={placeholder}
          />
        </FormField>

        {isPaginationEnabled && (
          <Tooltip
            content={`Move forward ${
              viewport && 'duration' in viewport
                ? viewport.duration
                : 'selected range'
            }`}
            position='bottom'
            children={
              <Button
                iconName='caret-right-filled'
                onClick={handlePaginateForward}
                ariaLabel='Move forward'
              />
            }
          />
        )}
      </SpaceBetween>
    </div>
  );
};
