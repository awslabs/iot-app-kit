import { DateRangePickerProps } from '@awsui/components-react';

export const getStartAndEndTimeFromRange = (
  newDateRange: DateRangePickerProps.AbsoluteValue | DateRangePickerProps.RelativeValue,
  currentDateTimeForRelativeValue?: Date
) => {
  let startAndEndTime = undefined;
  if ('relative' === newDateRange.type) {
    let offset = 0;
    switch (newDateRange.unit) {
      case 'second':
        offset = newDateRange.amount;
        break;
      case 'minute':
        offset = newDateRange.amount * 60;
        break;
      case 'hour':
        offset = newDateRange.amount * 3600;
        break;
      case 'day':
        offset = newDateRange.amount * 86400;
        break;
      case 'week':
        offset = newDateRange.amount * 604800;
        break;
      case 'month':
        offset = newDateRange.amount * 2678400;
        break;
      case 'year':
        offset = newDateRange.amount * 31536000;
        break;
    }
    const startTimeSeconds = currentDateTimeForRelativeValue.getTime() / 1000;
    // Upload start time (in miliseconds) = current - offset (before x seconds from now)
    const startTime = new Date((startTimeSeconds - offset) * 1000).getTime().toString();
    // Upload end time (in miliseconds) = current time
    const endTime = currentDateTimeForRelativeValue.getTime().toString();
    startAndEndTime = { startTime, endTime };
  } else if ('absolute' === newDateRange.type) {
    const startTime = new Date(newDateRange.startDate).getTime().toString();
    const endTime = new Date(newDateRange.endDate).getTime().toString();
    startAndEndTime = { startTime, endTime };
  }

  return startAndEndTime;
};
