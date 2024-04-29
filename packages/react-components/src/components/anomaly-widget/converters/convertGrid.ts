import { ANOMALY_GRID } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertGrid = ({
  showYAxis,
  showTimestamp,
}: Pick<ConfigurationOptions, 'showYAxis' | 'showTimestamp'>) => ({
  ...ANOMALY_GRID,
  left: showYAxis ? 45 : 15,
  bottom: showTimestamp ? 80 : 50,
});
