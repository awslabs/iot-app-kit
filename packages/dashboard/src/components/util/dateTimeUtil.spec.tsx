import {
  getFormattedDateTime,
  getFormattedDateTimeFromEpoch,
} from './dateTimeUtil';

it('should format the Date to full Date and Time value', () => {
  const rawDate = new Date(
    1665583620000 + new Date().getTimezoneOffset() * 60000
  );
  expect(getFormattedDateTime(rawDate)).toEqual(`10/12/22 14:07:00`);
});

it('should format the epoch seconds to Date and Time value', () => {
  const rawDate = 1698641538;
  const time = new Date(rawDate * 1000).toTimeString().split(' ')[0];
  expect(getFormattedDateTimeFromEpoch(rawDate)).toEqual(`10/30/23 ${time}`);
});
