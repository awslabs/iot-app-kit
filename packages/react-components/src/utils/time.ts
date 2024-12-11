import type { TimeInNanos } from '@aws-sdk/client-iotsitewise';
import parse from 'parse-duration';
import { utcToZonedTime, format } from 'date-fns-tz';
import {
  NANO_SECOND_IN_MS,
  SECOND_IN_MS,
  MINUTE_IN_MS,
  HOUR_IN_MS,
  DAY_IN_MS,
} from '@iot-app-kit/helpers';

// Not precisely accurate, only estimates. exact duration depends on start date. use with care.
export const MONTH_IN_MS = 30 * DAY_IN_MS;
export const YEAR_IN_MS = 12 * MONTH_IN_MS;
export const DEFAULT_DATE_TIME = 'yyyy-MM-dd hh:mm:ss aaaa';

// Global time format strings
export const SHORT_TIME = 'hh:mm a';
export const FULL_DATE = 'yyyy-MM-dd hh:mm:ss a';

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

export const displayDate = (
  date: Date,
  resolution: number,
  { start, end }: { start: Date; end: Date }
): string => {
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

/** converts the TimeInNanos to milliseconds */
export const toTimestamp = (time: TimeInNanos | undefined): number =>
  (time &&
    Math.floor(
      (time.timeInSeconds || 0) * SECOND_IN_MS +
        (time.offsetInNanos || 0) * NANO_SECOND_IN_MS
    )) ||
  0;

// https://date-fns.org/v3.6.0/docs/Time-Zones#date-fns-tz
// converts an epoch date to a formatted string in a specific timeZone
export const formatDate = (
  dateTime: number,
  options?: { timeZone?: string; pattern?: string }
) => {
  const formatPattern = options?.pattern ?? DEFAULT_DATE_TIME;

  const userTimeZone =
    options?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert epoch time to a zoned date object
  const zonedDate = utcToZonedTime(new Date(dateTime), userTimeZone);

  const formattedString = format(zonedDate, formatPattern, {
    timeZone: userTimeZone,
  });

  return formattedString;
};

// Based on echarts implementation: https://github.com/apache/echarts/blob/master/src/util/time.ts#L223C3-L223C31
// Based on https://github.com/apache/echarts/blob/master/src/util/time.ts#L33 default values
export const getPatternForXAxisLabelForAnomalyChart = (
  time: number
): string => {
  const { isSecond, isMinute, isHour, isDay, isMonth, isYear } =
    getAxisDateInfo(time);

  let pattern;
  if (isYear) {
    pattern = 'yyyy';
  } else if (isMonth) {
    pattern = 'MMM';
  } else if (isDay) {
    pattern = 'MMM d';
  } else if (isHour) {
    pattern = "MMM d'\n'HH:mm";
  } else if (isMinute) {
    pattern = "MMM d'\n'HH:mm";
  } else if (isSecond) {
    pattern = "MMM d'\n'HH:mm:ss";
  } else {
    pattern = "MMM d'\n'HH:mm:ss SSS";
  }

  return pattern;
};

export const getPatternForXAxisLabelForLineChart = (time: number): string => {
  const { isSecond, isMinute, isHour, isDay, isMonth, isYear } =
    getAxisDateInfo(time);

  let pattern;
  if (isYear) {
    pattern = 'yyyy';
  } else if (isMonth) {
    pattern = 'MMM';
  } else if (isDay) {
    pattern = 'd';
  } else if (isHour) {
    pattern = 'HH:mm';
  } else if (isMinute) {
    pattern = 'HH:mm';
  } else if (isSecond) {
    pattern = 'HH:mm:ss';
  } else {
    pattern = 'HH:mm:ss SSS';
  }

  return pattern;
};

const getAxisDateInfo = (time: number) => {
  const date: Date = new Date(Math.round(time));

  const M: number = date.getMonth() + 1;
  const d: number = date.getDate();
  const h: number = date.getHours();
  const m: number = date.getMinutes();
  const s: number = date.getSeconds();
  const S: number = date.getMilliseconds();

  const isSecond: boolean = S === 0;
  const isMinute: boolean = isSecond && s === 0;
  const isHour: boolean = isMinute && m === 0;
  const isDay: boolean = isHour && h === 0;
  const isMonth: boolean = isDay && d === 1;
  const isYear: boolean = isMonth && M === 1;

  return { isSecond, isMinute, isHour, isDay, isMonth, isYear };
};
