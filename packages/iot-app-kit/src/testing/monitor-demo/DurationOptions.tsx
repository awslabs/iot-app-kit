import { h } from '@stencil/core';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, MONTH_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from '../../utils/time';

const DISABLE_DURATION = -1;

type DurationOption = {
  label: string;
  duration: number;
};

const OPTIONS: DurationOption[] = [
  {
    duration: 30 * SECOND_IN_MS,
    label: 'Last 30 Seconds',
  },
  {
    duration: 10 * MINUTE_IN_MS,
    label: 'Last Ten Minutes',
  },
  {
    duration: HOUR_IN_MS,
    label: 'Last Hour',
  },
  {
    duration: DAY_IN_MS,
    label: 'Last Day',
  },
  {
    duration: MONTH_IN_MS,
    label: 'Last Month',
  },
  {
    duration: YEAR_IN_MS,
    label: 'Last Year',
  },
  {
    duration: 10 * YEAR_IN_MS,
    label: 'Last Decade',
  },
];

export const DurationOptions = ({
  duration,
  changeDuration,
}: {
  duration: number;
  changeDuration: (duration: number) => void;
}) => (
  <label htmlFor="duration-select" style={{ marginLeft: '12px' }}>
    <strong>Viewing: </strong>
    <select
      id="duration-select"
      onChange={(e: Event) => {
        if (e != null && e.target != null) {
          // @ts-ignore
          const newDuration = (e.target as unknown).value as number;

          changeDuration(newDuration);
        }
      }}
    >
      <option disabled value={DISABLE_DURATION} selected={duration === DISABLE_DURATION}>
        Fixed Time Range
      </option>
      {OPTIONS.map(({ label, duration: d }) => (
        <option key={label} selected={duration === d} value={d}>
          {label}
        </option>
      ))}
    </select>
  </label>
);
