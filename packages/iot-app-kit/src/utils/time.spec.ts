import { MINUTE_IN_MS, parseDuration, SECOND_IN_MS } from './time';

it('returns duration as is when it is a number', () => {
  const duration = SECOND_IN_MS;
  expect(parseDuration(duration)).toBe(duration);
});

it('returns duration as number when it is expressed as a string', () => {
  expect(parseDuration('1s')).toBe(SECOND_IN_MS);
});

it('returns a default of 10 minutes when it is unable to parse the string', () => {
  expect(parseDuration('blah-blah')).toBe(10 * MINUTE_IN_MS);
});
