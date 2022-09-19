import { getFormattedDateTime, getNewSeekTime } from './dateTimeUtils';

// TimezoneOffset is included to make sure that output is calucalted as expected result without timezone issue during test
it('should format the Date to DateTime value', () => {
  const rawDate = new Date(1665583620000 + new Date().getTimezoneOffset() * 60000);
  expect(getFormattedDateTime(rawDate)).toEqual(`10/12\n14:07:00`);
});

it('should return correct seek time', () => {
  expect(
    getNewSeekTime(
      10,
      {
        x: 2,
        width: 200,
        height: 10,
        y: 0,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        toJSON: jest.fn(),
      },
      1665583620000,
      1665583720000
    )
  ).toEqual(1665583624000);
});
