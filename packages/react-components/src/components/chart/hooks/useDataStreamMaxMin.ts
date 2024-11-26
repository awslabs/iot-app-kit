import isEqual from 'lodash-es/isEqual';
import { useChartStore } from '../store';

export const useDataStreamMaxMin = () => {
  const dataStreamMaxes = useChartStore(
    (state) => state.dataStreamMaxes,
    isEqual
  );

  const dataStreamMins = useChartStore(
    (state) => state.dataStreamMins,
    isEqual
  );

  return {
    dataStreamMaxes,
    dataStreamMins,
  };
};
