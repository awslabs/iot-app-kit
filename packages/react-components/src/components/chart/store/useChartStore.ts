import { useContext } from 'react';
import { useStore } from 'zustand';
import { ChartStoreContext } from './context';
import { type StateData } from './store';

export const useChartStore = <T>(
  selector: (state: StateData) => T,
  equals?: (a: T, b: T) => boolean
) => {
  const chartStore = useContext(ChartStoreContext);
  return useStore(chartStore, selector, equals);
};
