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

/**
 * ConvertMS is a helper function that will take in milliseconds and convert it to the highest detonator
 * and does not return the "remainder"
 *
 * It is important to note that the object returning does not represent equivalence!
 *
 * For Example:
 * convert(MINUTE_IN_MS) will return:
 * {
 *   day: 0,
 *   hour: 0
 *   minute: 1,
 *   seconds: 0,
 * }
 *
 * IT DOES NOT RETURN:
 *
 * {
 *   day: 0,
 *   hour: 0,
 *   minute: 1,
 *   seconds: 60, <--- does not return the "equivalence"
 * }
 */
export const convertMS = (
  milliseconds: number
): {
  day: number;
  hour: number;
  minute: number;
  seconds: number;
} => {
  if (milliseconds < 0) {
    throw new Error('Time cannot be negative!');
  }
  let seconds = Math.floor(milliseconds / 1000);
  let minute = Math.floor(seconds / 60);
  let hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  seconds %= 60;
  minute %= 60;
  hour %= 24;

  return {
    day,
    hour,
    minute,
    seconds,
  };
};

export const displayDate = (date: Date, resolution: number, { start, end }: { start: Date; end: Date }): string => {
  const viewportDurationMS = end.getTime() - start.getTime();
  if (resolution < HOUR_IN_MS) {
    if (viewportDurationMS < MINUTE_IN_MS) {
      return date.toLocaleString('en-US', {
        minute: 'numeric',
        second: 'numeric',
      });
    }

    if (viewportDurationMS <= 10 * MINUTE_IN_MS) {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
    }

    if (viewportDurationMS <= HOUR_IN_MS) {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }

    if (viewportDurationMS <= DAY_IN_MS) {
      return date.toLocaleString('en-US', {
        hour12: true,
        hour: 'numeric',
        month: 'numeric',
        minute: 'numeric',
        day: 'numeric',
      });
    }

    if (viewportDurationMS <= MONTH_IN_MS) {
      return date.toLocaleString('en-US', {
        hour12: true,
        hour: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    }

    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }

  if (resolution <= HOUR_IN_MS) {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      hour12: true,
    });
  }

  if (resolution < DAY_IN_MS) {
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'numeric',
    });
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const parseDuration = (duration: number | string): number => {
  if (typeof duration === 'number') {
    return duration;
  }

  const parsedTime = parse(duration, 'ms');

  // if duration is a string but we cannot parse it, we default to 10 mins.
  return parsedTime != null ? parsedTime : 10 * MINUTE_IN_MS;
};
