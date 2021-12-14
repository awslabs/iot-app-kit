import { MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../../common/time';

export enum SupportedResolutions {
  ONE_MINUTE = '1m',
  ONE_HOUR = '1h',
  ONE_DAY = '1d',
}

export const RESOLUTION_TO_MS_MAPPING: { [key: string]: number } = {
  '0': 0,
  [SupportedResolutions.ONE_MINUTE]: MINUTE_IN_MS,
  [SupportedResolutions.ONE_HOUR]: HOUR_IN_MS,
  [SupportedResolutions.ONE_DAY]: DAY_IN_MS,
};
