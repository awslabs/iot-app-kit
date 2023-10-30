import { getFormattedDateTime } from './dateTimeUtil';

it('should format the Date to full Date and Time value', () => {
  const rawDate = new Date(1665583620000 + new Date().getTimezoneOffset() * 60000);
  expect(getFormattedDateTime(rawDate)).toEqual(`10/12/22 14:07:00`);
});
