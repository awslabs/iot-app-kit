import { DateRangePickerProps } from '@cloudscape-design/components';

/**
 *
 * Range validation function for the cloudscape date range picker
 * uses configurable errorMessages for
 * dateRangeIncomplete: missing start and or end date
 * dateRangeInvalid: start date comes after end date
 *
 */
export const rangeValidator =
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
