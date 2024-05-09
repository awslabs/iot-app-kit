import { ANOMALY_Y_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertYAxis = ({ axis }: Pick<ConfigurationOptions, 'axis'>) => ({
  ...ANOMALY_Y_AXIS,
  axisLabel: {
    ...ANOMALY_Y_AXIS.axisLabel,
    show: axis?.showY ?? true,
  },
});
