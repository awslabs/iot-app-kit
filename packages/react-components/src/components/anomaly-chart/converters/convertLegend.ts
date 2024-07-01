import { ANOMALY_LEGEND, ANOMALY_LEGEND_PADDING } from '../constants';

export const convertLegend = () => ({
  ...ANOMALY_LEGEND,
  padding: ANOMALY_LEGEND_PADDING,
});
