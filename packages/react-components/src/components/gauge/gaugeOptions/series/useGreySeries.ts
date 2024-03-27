import { useMemo } from 'react';
import { GaugeProps } from '../../types';

export const useGreySeries = ({ settings }: Pick<GaugeProps, 'settings'>) => {
  return useMemo(() => {
    return {
      min: settings?.yMin,
      max: settings?.yMax,
      axisLine: {
        lineStyle: {
          width: settings?.gaugeThickness,
        },
      },
    };
  }, [settings?.yMax, settings?.yMin, settings?.gaugeThickness]);
};
