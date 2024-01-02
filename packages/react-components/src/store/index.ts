import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ConfigState, createConfigSlice, Flags } from './config';
import { ChartStoreState, createChartStoresSlice } from './chartStoreSlice';
import {
  createTrendCursorsSlice,
  TrendCursorsState,
} from '../echarts/extensions/trendCursors/store';

export type StateData = TrendCursorsState & ConfigState & ChartStoreState;
const useDataStore = create<StateData>()(
  devtools(
    persist(
      (...args) => ({
        ...createTrendCursorsSlice(...args),
        ...createConfigSlice(...args),
        ...createChartStoresSlice(...args),
      }),
      {
        name: 'global-store',
      }
    )
  )
);

export default useDataStore;

export const useGetConfigValue = (configName: Flags) =>
  useDataStore((state) => state.config[configName]);
