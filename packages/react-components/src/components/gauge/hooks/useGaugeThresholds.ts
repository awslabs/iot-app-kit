import { useMemo } from 'react';
import { GaugeProps } from '../types';
import { getThresholds } from '../utils/getThresholds';

export const useGaugeThresholds = ({
  hasThresholds,
  settings,
  thresholds,
}: Pick<GaugeProps, 'settings' | 'thresholds'> & {
  hasThresholds: boolean;
}) => {
  return useMemo(() => {
    return hasThresholds ? getThresholds({ settings, thresholds }) : null;
  }, [hasThresholds, settings, thresholds]);
};
