import { ANOMALY_Y_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertYAxis = ({
  showYAxis,
}: Pick<ConfigurationOptions, 'showYAxis'>) => ({
  ...ANOMALY_Y_AXIS,
  axisLabel: {
    ...ANOMALY_Y_AXIS.axisLabel,
    show: showYAxis,
  },
});
