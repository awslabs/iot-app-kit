import { useCallback, useMemo } from 'react';
import { useViewport } from '../viewport-manager';
import { DateRangePicker, DateRangePickerProps, NonCancelableCustomEvent } from '@awsui/components-react';
import React from 'react';

const mapUnit = (unit: DateRangePickerProps.TimeUnit) => {
  switch (unit) {
    case 'day':
      return 'd';
    case 'minute':
      return 'm';
    case 'hour':
      return 'h';
    case 'week':
      return 'w';
  }
};

const reverseMapUnit = (symbol: string): DateRangePickerProps.TimeUnit => {
  switch (symbol) {
    case 'd':
      return 'day';
    case 'h':
      return 'hour';
    case 'w':
      return 'week';
    default:
      return 'minute';
  }
};

const parseDuration = (duration: string) => {
  const amount = parseInt(duration);
  const unitRef = duration.split(`${amount}`)[1];

  return {
    amount,
    unit: reverseMapUnit(unitRef),
  };
};

const ViewportControls = ({ value: defaultValue, onChange, ...props }: DateRangePickerProps) => {
  const { update, reset, viewport } = useViewport();

  const value: DateRangePickerProps.Value | null = useMemo(() => {
    const relativeViewport = viewport as { duration: string };
    const absoluteViewport = viewport as { start: Date; end: Date };
    if (relativeViewport?.duration) {
      const { amount, unit } = parseDuration(relativeViewport.duration);

      return {
        amount,
        type: 'relative',
        unit,
      } as DateRangePickerProps.RelativeValue;
    } else if (absoluteViewport?.start && absoluteViewport?.end) {
      return {
        startDate: absoluteViewport.start.toLocaleString(),
        endDate: absoluteViewport.end.toLocaleString(),
        type: 'absolute',
      } as DateRangePickerProps.AbsoluteValue;
    }

    return null;
  }, [viewport]);

  const onChangeHandler = useCallback(
    (e: NonCancelableCustomEvent<DateRangePickerProps.ChangeDetail>) => {
      const { detail } = e;
      const { value: newValue } = detail;

      if (newValue) {
        if (newValue.type === 'absolute') {
          const { startDate, endDate } = newValue as DateRangePickerProps.AbsoluteValue;

          update({
            start: new Date(startDate),
            end: new Date(endDate),
          });
        } else {
          const { amount, unit } = newValue as DateRangePickerProps.RelativeValue;
          update({
            duration: `${amount}${mapUnit(unit)}`,
          });
        }
      } else {
        reset();
      }

      if (onChange) {
        onChange(e);
      }
    },
    [update, reset]
  );

  return <DateRangePicker onChange={onChangeHandler} value={value} {...props} />;
};

export default ViewportControls;
