import merge from 'lodash-es/merge';
import { formatDate } from '@iot-app-kit/core';
import { getPatternForXAxisLabelForAnomalyChart } from '../../../utils/time';
import { ANOMALY_X_AXIS } from '../constants';
import { type ConfigurationOptions } from '../hooks/types';

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
