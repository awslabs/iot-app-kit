import React from 'react';

import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import FormField from '@cloudscape-design/components/form-field';
import type { DateRangePickerProps } from '@cloudscape-design/components/date-range-picker';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';

import { dateRangeToViewport, relativeOptions, viewportToDateRange } from './viewportAdapter';
import { rangeValidator } from './rangeValidator';
import { useViewport } from '../../hooks/useViewport';

export type ViewportMessages = DateRangePickerProps.I18nStrings & {
  title: string;
  placeholder: string;
  dateRangeIncompleteError: string;
  dateRangeInvalidError: string;
};
const messages: ViewportMessages = {
  title: 'Time machine',
  placeholder: 'Dashboard time range',
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next month',
  previousMonthAriaLabel: 'Previous month',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  dateTimeConstraintText: 'For date, use YYYY/MM/DD. For time, use 24 hr format.',
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
  formatRelativeRange: (e) => (e.amount === 1 ? `Last ${e.unit}` : `Last ${e.amount} ${e.unit}s`),
  formatUnit: (e, n) => (1 === n ? e : `${e}s`),
  dateRangeIncompleteError: 'The selected date range is incomplete. Select a start and end date for the date range.',
  dateRangeInvalidError: 'The selected date range is invalid. The start date must be before the end date.',
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
export const TimeSelection = () => {
  const { viewport, setViewport } = useViewport();

  const handleChangeDateRange: NonCancelableEventHandler<DateRangePickerProps.ChangeDetail> = (event) => {
    const { value } = event.detail;

    if (!value) return;

    setViewport(dateRangeToViewport(value));
  };

  const { title, placeholder, dateRangeIncompleteError, dateRangeInvalidError, ...i18nStrings } = messages;

  return (
    <FormField label={title}>
      <DateRangePicker
        expandToViewport={true}
        onChange={handleChangeDateRange}
        value={viewportToDateRange(viewport)}
        showClearButton={false}
        relativeOptions={relativeOptions}
        isValidRange={rangeValidator({ dateRangeIncompleteError, dateRangeInvalidError })}
        i18nStrings={i18nStrings}
        placeholder={placeholder}
      />
    </FormField>
  );
};
