import { getDecimalValueFromMinMax } from './getDecimalValueFromMinMax';
import { GaugeProps } from '../types';
import { DEFAULT_GAUGE_PROGRESS_COLOR } from '../constants';

export const getThresholds = ({
  settings,
  thresholds,
}: Pick<GaugeProps, 'settings' | 'thresholds'>) => {
  const newArray = thresholds?.map(({ value, color }) => {
    return [
      getDecimalValueFromMinMax({
        value,
        min: settings?.yMin,
        max: settings?.yMax,
      }),
      color,
    ];
  });

  /*
   * Add default threshold at 100% if none is defined
   * This is required for ECharts to show the gauge correctly
   */
  if (!newArray?.some((item) => item[0] === 1)) {
    newArray?.push([1, DEFAULT_GAUGE_PROGRESS_COLOR]);
  }

  return newArray;
};
