import type { RefreshRateString, RefreshRateOption } from './types';
import { type RefreshRate } from '@iot-app-kit/core';

export const SECOND_IN_MS = 1000 as const satisfies RefreshRate;
export const SECOND_IN_MS_STRING = '1000' as const satisfies RefreshRateString;

export const FIVE_SECONDS_IN_MS = 5000 as const satisfies RefreshRate;
export const FIVE_SECONDS_IN_MS_STRING =
  '5000' as const satisfies RefreshRateString;

export const TEN_SECONDS_IN_MS = 10000 as const satisfies RefreshRate;
export const TEN_SECONDS_IN_MS_STRING =
  '10000' as const satisfies RefreshRateString;

export const MINUTE_IN_MS = 60000 as const satisfies RefreshRate;
export const MINUTE_IN_MS_STRING = '60000' as const satisfies RefreshRateString;

export const FIVE_MINUTES_IN_MS = 300000 as const satisfies RefreshRate;
export const FIVE_MINUTES_IN_MS_STRING =
  '300000' as const satisfies RefreshRateString;

export const REFRESH_RATE_OPTIONS = [
  { label: '1s', value: SECOND_IN_MS_STRING },
  { label: '5s', value: FIVE_SECONDS_IN_MS_STRING },
  { label: '10s', value: TEN_SECONDS_IN_MS_STRING },
  { label: '1m', value: MINUTE_IN_MS_STRING },
  { label: '5m', value: FIVE_MINUTES_IN_MS_STRING },
] satisfies RefreshRateOption[];

export const DEFAULT_REFRESH_RATE_OPTION = REFRESH_RATE_OPTIONS[1];

type RefreshRateOptionMap = {
  [key in RefreshRate]: RefreshRateOption;
};

export const REFRESH_RATE_OPTION_MAP =
  REFRESH_RATE_OPTIONS.reduce<RefreshRateOptionMap>(
    (optionMap, { label, value }) => ({
      ...optionMap,
      [parseInt(value, 10)]: { label, value },
    }),
    {} as RefreshRateOptionMap
  );
