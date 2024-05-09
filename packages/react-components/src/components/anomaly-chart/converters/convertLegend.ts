import {
  ANOMALY_LEGEND,
  ANOMALY_LEGEND_LOADING_PADDING,
  ANOMALY_LEGEND_PADDING,
} from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertLegend = ({
  loading,
}: Pick<ConfigurationOptions, 'loading'>) => ({
  ...ANOMALY_LEGEND,
  padding: loading ? ANOMALY_LEGEND_LOADING_PADDING : ANOMALY_LEGEND_PADDING,
});
