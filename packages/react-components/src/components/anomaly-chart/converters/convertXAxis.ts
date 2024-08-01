import merge from 'lodash.merge';
import { ANOMALY_X_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';
import {
  getPatternForXAxisLabelForAnomalyChart,
  formatDate,
} from '../../../utils/time';

export const convertXAxis = ({ axis, timeZone }: ConfigurationOptions) => {
  const show = axis?.showX ?? true;

  return merge({}, ANOMALY_X_AXIS.xAxis, {
    axisLabel: {
      show: show,
      align: 'center',
      formatter: (value: number) => {
        const pattern = getPatternForXAxisLabelForAnomalyChart(value);
        return formatDate(value, { pattern, timeZone });
      },
    },
    name: show ? axis?.xLabel || 'Time' : undefined,
  });
};
