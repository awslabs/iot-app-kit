import { useMemo } from 'react';
import { GaugeProps } from '../types';
import { convertThresholdsToEchartsValuePair } from '../utils/convertThresholdsToEchartsValuePair';

export const useGaugeThresholds = ({
  hasThresholds,
  settings,
  thresholds,
}: Pick<GaugeProps, 'settings' | 'thresholds'> & {
  hasThresholds: boolean;
}) => {
  return useMemo(() => {
    return hasThresholds
      ? convertThresholdsToEchartsValuePair({ settings, thresholds })
      : null;
  }, [hasThresholds, settings, thresholds]);
};
