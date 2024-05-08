import merge from 'lodash.merge';
import { ANOMALY_X_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertXAxis = ({ axis }: Pick<ConfigurationOptions, 'axis'>) =>
  merge({}, ANOMALY_X_AXIS.xAxis, {
    axisLabel: {
      show: axis?.showX ?? true,
    },
  });
