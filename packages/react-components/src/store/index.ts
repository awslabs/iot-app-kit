import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createTrendCursorsSlice, TrendCursorsState } from './trendCusorSlice';
import { ConfigState, createConfigSlice, Flags } from './config';
import { ChartStoreState, createChartStoresSlice } from './chartStoreSlice';

export type StateData = TrendCursorsState & ConfigState & ChartStoreState;
const useDataStore = create<StateData>()(
  devtools((...args) => ({
    ...createTrendCursorsSlice(...args),
    ...createConfigSlice(...args),
    ...createChartStoresSlice(...args),
  }))
);

export default useDataStore;

export const useGetConfigValue = (configName: Flags) =>
  useDataStore((state) => state.config[configName]);
