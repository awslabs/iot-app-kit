import React, { memo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import FormField from '@cloudscape-design/components/form-field';

import { onUpdateViewportAction } from '~/store/actions';
import { DashboardState } from '~/store/state';

import { dateRangeToViewport, relativeOptions, viewportToDateRange } from './viewportAdapter';
import type { DateRangePickerProps } from '@cloudscape-design/components/date-range-picker';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { DashboardMessages } from '~/messages';

export type ViewportSelectionProps = {
  messageOverrides: DashboardMessages;
  expandToViewport?: boolean;
};

const rangeValidator =
  ({
    dateRangeIncompleteError,
    dateRangeInvalidError,
  }: {
    dateRangeIncompleteError: string;
    dateRangeInvalidError: string;
  }): DateRangePickerProps.ValidationFunction =>
  (range: DateRangePickerProps.Value | null) => {
    if (range?.type === 'absolute') {
      const [startDateWithoutTime] = range.startDate.split('T');
      const [endDateWithoutTime] = range.endDate.split('T');
      if (!startDateWithoutTime || !endDateWithoutTime) {
        return {
          valid: false,
          errorMessage: dateRangeIncompleteError,
        };
      }
      const startTime = new Date(range.startDate).getTime();
      const endTime = new Date(range.endDate).getTime();
      if (startTime - endTime > 0) {
        return {
          valid: false,
          errorMessage: dateRangeInvalidError,
        };
      }
    }
    return { valid: true };
  };

const ViewportSelection: React.FC<ViewportSelectionProps> = ({ expandToViewport = true, messageOverrides }) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const dispatch = useDispatch();

  const handleChangeDateRange: NonCancelableEventHandler<DateRangePickerProps.ChangeDetail> = (event) => {
    const { value } = event.detail;

    if (!value) return;

    const viewport = dateRangeToViewport(value);

    dispatch(
      onUpdateViewportAction({
        viewport,
      })
    );
  };

  const { title, placeholder, dateRangeIncompleteError, dateRangeInvalidError, ...i18nStrings } =
    messageOverrides.viewport;

  return (
    <FormField label={title}>
      <DateRangePicker
        expandToViewport={expandToViewport}
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

export default memo(ViewportSelection);
