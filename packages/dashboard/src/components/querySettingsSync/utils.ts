import {
  SECOND_IN_MS,
  FIVE_SECONDS_IN_MS,
  TEN_SECONDS_IN_MS,
  MINUTE_IN_MS,
  FIVE_MINUTES_IN_MS,
} from './types';
import { type SelectProps } from '@cloudscape-design/components';

export const DEFAULT_REFRESH_RATE = 5000; // 5 seconds
export const DEFAULT_OPTION = { label: '5s', value: '5000' };

export const refreshRateOptions = [
  { label: '1s', value: SECOND_IN_MS.toString() },
  { label: '5s', value: FIVE_SECONDS_IN_MS.toString() },
  { label: '10s', value: TEN_SECONDS_IN_MS.toString() },
  { label: '1m', value: MINUTE_IN_MS.toString() },
  { label: '5m', value: FIVE_MINUTES_IN_MS.toString() },
] satisfies SelectProps['selectedOption'][];

export const DEFAULT_REFRESH_RATE_OPTION = refreshRateOptions[1];

export const refreshRateOptionMap: {
  [key: string]: SelectProps['selectedOption'];
} = refreshRateOptions.reduce(
  (optionMap, { label, value }) => ({
    ...optionMap,
    [parseInt(value, 10)]: { label, value },
  }),
  {}
);
