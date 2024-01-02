import { useContext } from 'react';
import { ChartStoreContext } from './context';
import { StateData } from './store';

export const useChartStore = <T>(
  selector: (state: StateData) => T,
  equals?: (a: T, b: T) => boolean
) => useContext(ChartStoreContext)(selector, equals);
