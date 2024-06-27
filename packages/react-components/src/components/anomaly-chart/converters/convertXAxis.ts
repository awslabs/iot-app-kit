import merge from 'lodash.merge';
import { ANOMALY_X_AXIS } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertXAxis = ({ axis }: Pick<ConfigurationOptions, 'axis'>) =>
  merge({}, ANOMALY_X_AXIS.xAxis, {
    axisLabel: {
      show: axis?.showX ?? true,
      align: 'center',
      formatter: {
        year: `{yyyy}`,
        month: `{MMM}`,
        day: '{MMM} {d}',
        hour: '{MMM} {d}\n{HH}:{mm}',
        minute: '{MMM} {d}\n{HH}:{mm}',
        second: '{MMM} {d}\n{HH}:{mm}:{ss}',
        millisecond: '{MMM} {d}\n{hh}:{mm}:{ss} {SSS}',
        none: `{yyyy}-{MM}={dd} {hh}:{mm}:{ss} {SSS}`,
      },
    },
  });
