import parse from 'parse-duration';
import type { DateRangePickerProps } from '@cloudscape-design/components';
import type { DashboardWidgetsConfiguration } from '~/types';

const relativeOptionKey = (amount: number, unit: DateRangePickerProps.TimeUnit): string =>
  `previous-${amount}-${unit}s`;

const relativeOption = (amount: number, unit: DateRangePickerProps.TimeUnit): DateRangePickerProps.RelativeOption => ({
  key: relativeOptionKey(amount, unit),
  amount,
  unit,
  type: 'relative',
});

export const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  relativeOption(1, 'minute'),
  relativeOption(5, 'minute'),
  relativeOption(10, 'minute'),
  relativeOption(30, 'minute'),
  relativeOption(1, 'hour'),
  relativeOption(1, 'day'),
  relativeOption(7, 'day'),
  relativeOption(30, 'day'),
  relativeOption(90, 'day'),
];

export const dateRangeToViewport = (value: DateRangePickerProps.Value): DashboardWidgetsConfiguration['viewport'] => {
  if (value.type === 'relative') return { duration: `${value.amount} ${value.unit}` };
  return {
    start: new Date(value.startDate),
    end: new Date(value.endDate),
  };
};

export const viewportToDateRange = (
  viewport: DashboardWidgetsConfiguration['viewport']
): DateRangePickerProps.Value | null => {
  if ('duration' in viewport) {
    const duration = viewport.duration;

    let amount: number | null = null;
    let unit: DateRangePickerProps.TimeUnit | null = null;

    if (typeof duration === 'string') {
      /**
       * This regex is taken from the parse-duration library
       * We need to identify if there are multiple durations included in the string.
       * If there are, we can infer that the duration was not created via the dashboard and must convert it into
       * some unit the dashboard can represent. For this scenario we are using seconds because it is the smallest
       * configurable unit on the dashboard.
       */
      const matches = duration.match(/(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/giu);
      if (!matches) return null;

      if (matches.length > 1) {
        // this is a custom duration that was not set by the dashboard
        amount = parse(duration, 's');
        unit = 'second';
      } else {
        // this was set by the dashboard or is easily mapped to an option in the dashboard
        const [d] = matches;

        const seconds = /(\d+)\s*ns|μs|ms|s/;
        const minutes = /(\d+)\s*m/;
        const hours = /(\d+)\s*h/;
        const days = /(\d+)\s*d/;
        const weeks = /(\d+)\s*w/;
        const months = /(\d+)\s*month/;
        const years = /(\d+)\s*y/;

        if (d.match(seconds)) {
          amount = parse(duration, 's');
          unit = 'second';
        } else if (d.match(minutes)) {
          amount = parse(duration, 'm');
          unit = 'minute';
        } else if (d.match(hours)) {
          amount = parse(duration, 'h');
          unit = 'hour';
        } else if (d.match(days)) {
          amount = parse(duration, 'd');
          unit = 'day';
        } else if (d.match(weeks)) {
          amount = parse(duration, 'w');
          unit = 'week';
        } else if (d.match(months)) {
          amount = parse(duration, 'month');
          unit = 'month';
        } else if (d.match(years)) {
          amount = parse(duration, 'y');
          unit = 'year';
        }
      }
    } else {
      // if duration is a number it is assumed to be in milliseconds
      amount = duration / 1000;
      unit = 'second';
    }

    if (!amount || !unit) return null;

    const key = relativeOptionKey(amount, unit);
    return {
      // If key is undefined, cloudscape will default to selecting the custom option.
      key: relativeOptions.find((ro) => ro.key === key)?.key,
      amount,
      unit,
      type: 'relative',
    };
  } else if ('start' in viewport && 'end' in viewport) {
    const { start, end } = viewport;
    const startDate = typeof start === 'string' ? start : start.toISOString();
    const endDate = typeof end === 'string' ? end : end.toISOString();
    return {
      type: 'absolute',
      startDate,
      endDate,
    };
  }

  return null;
};
