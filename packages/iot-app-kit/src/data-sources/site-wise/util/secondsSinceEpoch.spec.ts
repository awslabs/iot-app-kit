import { secondsSinceEpoch } from './secondsSinceEpoch';

const DATE = new Date(2000, 0, 0);

it('converts date to seconds since epoch', () => {
  const seconds = secondsSinceEpoch(DATE);
  const dateDeserialized = new Date(0);

  dateDeserialized.setUTCSeconds(seconds);
  expect(dateDeserialized.toISOString()).toBe(DATE.toISOString());
});

it('converts date to seconds since epoch with milliseconds truncated', () => {
  const seconds = secondsSinceEpoch(new Date(2000, 1, 1, 1, 1, 1, 99));

  expect(Math.round(seconds) - seconds).toBe(0);
});
