import { useMemo } from 'react';
import { GaugeProps } from '../../types';

/**
 * Generates a empty bar gauge series based on the provided settings and data.
 *
 * @param {Pick<GaugeProps, 'settings'>} settings - The parameters for generating the empty bar gauge series.
 * @return {object} - The generated empty bar gauge series.
 */
export const useEmptyGaugeSeries = ({
  settings,
}: Pick<GaugeProps, 'settings'>) => {
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
