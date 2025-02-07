import type { RefreshRateOption, RefreshRateString } from './types';

export const SECOND_IN_MS_STRING = '1000' as const satisfies RefreshRateString;
export const FIVE_SECONDS_IN_MS_STRING =
  '5000' as const satisfies RefreshRateString;
export const TEN_SECONDS_IN_MS_STRING =
  '10000' as const satisfies RefreshRateString;
export const MINUTE_IN_MS_STRING = '60000' as const satisfies RefreshRateString;
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
  [key in number]: RefreshRateOption;
};

export const REFRESH_RATE_OPTION_MAP =
  REFRESH_RATE_OPTIONS.reduce<RefreshRateOptionMap>(
    (optionMap, { label, value }) => ({
      ...optionMap,
      [parseInt(value, 10)]: { label, value },
    }),
    {} as RefreshRateOptionMap
  );
