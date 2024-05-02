import { ANOMALY_X_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertXAxis = ({ axis }: Pick<ConfigurationOptions, 'axis'>) => ({
  ...ANOMALY_X_AXIS,
  axisLabel: {
    show: axis?.showX ?? true,
  },
});
