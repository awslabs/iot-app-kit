import {
  getFormattedDateTime,
  getFormattedDateTimeFromEpoch,
} from './dateTimeUtil';

it('should format the Date to full Date and Time value', () => {
  const rawDate = new Date(1665583620000);

  // Adjust for daylight saving time
  const timezoneOffset = rawDate.getTimezoneOffset();
  const adjustedDate = new Date(rawDate.getTime() + timezoneOffset * 60000);

  expect(getFormattedDateTime(adjustedDate)).toEqual('10/12/22 14:07:00');
});

it('should format the epoch seconds to Date and Time value', () => {
  const rawDate = 1698641538;
  const time = new Date(rawDate * 1000).toTimeString().split(' ')[0];
  expect(getFormattedDateTimeFromEpoch(rawDate)).toContain(`${time}`);
});
