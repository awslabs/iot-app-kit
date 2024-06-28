import { ANOMALY_Y_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertYAxis = ({ axis }: Pick<ConfigurationOptions, 'axis'>) => {
  const show = axis?.showY ?? true;

  return {
    ...ANOMALY_Y_AXIS,
    axisLabel: {
      ...ANOMALY_Y_AXIS.axisLabel,
      show,
    },
    name: show ? axis?.yLabel || 'Total contribution' : undefined,
  };
};
