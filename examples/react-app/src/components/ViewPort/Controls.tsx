import { useCallback, useMemo } from "react";
import { DateRangePicker, DateRangePickerProps } from "@cloudscape-design/components";
import React from "react";
import { useViewport } from "@iot-app-kit/react-components";

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
}

const reverseMapUnit = (symbol: string): DateRangePickerProps.TimeUnit => {
  switch(symbol) {
    case 'd':
      return 'day';
    case 'h':
      return 'hour';
    case 'w':
      return 'week';
    default:
      return 'minute'
  }
}

const parseDuration = (duration: string) => {
  const amount = parseInt(duration);
  const unitRef = duration.split(`${amount}`)[1];

  return {
    amount,
    unit: reverseMapUnit(unitRef),
  }
}

const ViewportControls = () => {
  const { setViewport, viewport } = useViewport();

  const value: DateRangePickerProps.Value = useMemo(() => {
    const vp = viewport as any;
    if (vp?.duration) {
      const { amount, unit } = parseDuration(vp.duration);

      return {
        amount,
        type: "relative",
        unit
      } as DateRangePickerProps.Value
    } else {
      return {
        startDate: vp?.start,
        endDate: vp?.end,
        type: 'absolute',
      }
    }
  }, [viewport]);

  const apply = useCallback((newValue: DateRangePickerProps.Value | null) => {
    if (newValue) {
      if (newValue.type === 'absolute') {
        const { startDate, endDate } = newValue as DateRangePickerProps.AbsoluteValue;

        setViewport({
          start: new Date(startDate),
          end: new Date(endDate)
        })
      }
      else {
        const { amount, unit } = newValue as DateRangePickerProps.RelativeValue;
        setViewport({
          duration: `${amount}${mapUnit(unit)}`, // TODO: This probably needs to account for the unit as well, need to see how that works in AppKit
        })
      }
    }
  }, [setViewport]);

  return (
    <DateRangePicker
      onChange={({ detail }) => apply(detail.value)}
      value={value}
      relativeOptions={[
        {
          key: "previous-5-minutes",
          amount: 5,
          unit: "minute",
          type: "relative"
        },
        {
          key: "previous-30-minutes",
          amount: 30,
          unit: "minute",
          type: "relative"
        },
        {
          key: "previous-1-hour",
          amount: 1,
          unit: "hour",
          type: "relative"
        },
        {
          key: "previous-6-hours",
          amount: 6,
          unit: "hour",
          type: "relative"
        }
      ]}
      isValidRange={range => {
        if (range?.type === "absolute") {
          const [
            startDateWithoutTime
          ] = range.startDate.split("T");
          const [
            endDateWithoutTime
          ] = range.endDate.split("T");
          if (
            !startDateWithoutTime ||
            !endDateWithoutTime
          ) {
            return {
              valid: false,
              errorMessage:
                "The selected date range is incomplete. Select a start and end date for the date range."
            };
          }
          if (
            Number(new Date(range.startDate)) - Number(new Date(range.endDate)) >
            0
          ) {
            return {
              valid: false,
              errorMessage:
                "The selected date range is invalid. The start date must be before the end date."
            };
          }
        }
        return { valid: true };
      }}
      i18nStrings={{
        todayAriaLabel: "Today",
        nextMonthAriaLabel: "Next month",
        previousMonthAriaLabel: "Previous month",
        customRelativeRangeDurationLabel: "Duration",
        customRelativeRangeDurationPlaceholder:
          "Enter duration",
        customRelativeRangeOptionLabel: "Custom range",
        customRelativeRangeOptionDescription:
          "Set a custom range in the past",
        customRelativeRangeUnitLabel: "Unit of time",
        formatRelativeRange: e => {
          const n =
            1 === e.amount ? e.unit : `${e.unit}s`;
          return `Last ${e.amount} ${n}`;
        },
        formatUnit: (e, n) => (1 === n ? e : `${e}s`),
        dateTimeConstraintText:
          "Range is 6 to 30 days. For date, use YYYY/MM/DD. For time, use 24 hr format.",
        relativeModeTitle: "Relative range",
        absoluteModeTitle: "Absolute range",
        relativeRangeSelectionHeading: "Choose a range",
        startDateLabel: "Start date",
        endDateLabel: "End date",
        startTimeLabel: "Start time",
        endTimeLabel: "End time",
        clearButtonLabel: "Clear and dismiss",
        cancelButtonLabel: "Cancel",
        applyButtonLabel: "Apply"
      }}
      placeholder="Filter by a date and time range"
    />
  )
}

export default ViewportControls;
