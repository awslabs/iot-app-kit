import { ANOMALY_GRID } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertGrid = ({
  axis,
  showTimestamp,
}: Pick<ConfigurationOptions, 'axis' | 'showTimestamp'>) => ({
  ...ANOMALY_GRID,
  left: axis?.showY ?? true ? 45 : 15,
  bottom: showTimestamp ? 90 : 60,
});
