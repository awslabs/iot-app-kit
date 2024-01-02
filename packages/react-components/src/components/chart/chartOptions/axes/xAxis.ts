import { ChartAxisOptions } from '../../types';
import { DEFAULT_X_AXIS } from '../../eChartsConstants';
import { useMemo } from 'react';

export const useXAxis = (axis?: ChartAxisOptions) => {
  const show = axis?.showX ?? DEFAULT_X_AXIS.show;

  return useMemo(
    () => ({
      show,
    }),
    [show]
  );
};
