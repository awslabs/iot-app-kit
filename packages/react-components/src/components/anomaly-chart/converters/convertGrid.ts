import { ANOMALY_GRID } from '../constants';
import { type ConfigurationOptions } from '../hooks/types';

export const convertGrid = ({
  axis,
  showTimestamp,
}: Pick<ConfigurationOptions, 'axis' | 'showTimestamp'>) => {
  const showX = axis?.showX ?? true;
  const bottomPadding = 35 + (showTimestamp ? 30 : 0) + (showX ? 44 : 0);
  return {
    ...ANOMALY_GRID,
    left: axis?.showY ?? true ? 45 : 15,
    bottom: bottomPadding,
  };
};
