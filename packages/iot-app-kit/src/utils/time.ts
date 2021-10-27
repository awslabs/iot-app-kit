import parse from 'parse-duration';

export const SECOND_IN_MS = 1000;
export const MINUTE_IN_MS = 60 * SECOND_IN_MS;
export const HOUR_IN_MS = 60 * MINUTE_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;
// Not precisely accurate, only estimates. exact duration depends on start date. use with care.
export const MONTH_IN_MS = 30 * DAY_IN_MS;
export const YEAR_IN_MS = 12 * MONTH_IN_MS;

// Global time format strings
export const SHORT_TIME = 'hh:mm a';
export const FULL_DATE = 'yyy-MM-dd hh:mm:ss a';

export const parseDuration = (duration: number | string): number => {
  if (typeof duration === 'number') {
    return duration;
  }

  const parsedTime = parse(duration, 'ms');

  // if duration is a string but we cannot parse it, we default to 10 mins.
  return parsedTime != null ? parsedTime : 10 * MINUTE_IN_MS;
};
