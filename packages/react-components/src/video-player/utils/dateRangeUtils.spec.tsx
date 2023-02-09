import { DateRangePickerProps } from '@awsui/components-react';
import { getStartAndEndTimeFromRange } from './dateRangeUtils';

it('should return start and end time for absolute range', () => {
  const newDateRange: DateRangePickerProps.AbsoluteValue = {
    startDate: '2021-04-06T17:23:50+02:00',
    endDate: '2021-04-06T17:23:55+02:00',
    type: 'absolute',
  };
  expect(getStartAndEndTimeFromRange(newDateRange)).toEqual({
    startTime: '1617722630000',
    endTime: '1617722635000',
  });
});

it('should return start and end time for relative range in seconds', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 5,
    unit: 'second',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setSeconds(currentDateTimeForRelativeValue.getSeconds() - 5);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in minutes', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 5,
    unit: 'minute',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setMinutes(currentDateTimeForRelativeValue.getMinutes() - 5);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in hours', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 5,
    unit: 'hour',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setHours(currentDateTimeForRelativeValue.getHours() - 5);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in days', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 1,
    unit: 'day',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setHours(currentDateTimeForRelativeValue.getHours() - 24);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in week', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 1,
    unit: 'week',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setHours(currentDateTimeForRelativeValue.getHours() - 24 * 7);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in month', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 1,
    unit: 'month',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setHours(currentDateTimeForRelativeValue.getHours() - 24 * 31);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});

it('should return start and end time for relative range in year', () => {
  const newDateRange: DateRangePickerProps.RelativeValue = {
    amount: 1,
    unit: 'year',
    type: 'relative',
  };
  const currentDateTimeForRelativeValue = new Date();
  const actualResult = getStartAndEndTimeFromRange(newDateRange, currentDateTimeForRelativeValue);

  const endTime = currentDateTimeForRelativeValue.getTime().toString();
  currentDateTimeForRelativeValue.setHours(currentDateTimeForRelativeValue.getHours() - 24 * 365);
  const expectedResult = {
    startTime: currentDateTimeForRelativeValue.getTime().toString(),
    endTime,
  };
  expect(actualResult).toEqual(expectedResult);
});
