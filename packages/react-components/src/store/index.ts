import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createTrendCursorsSlice, TrendCursorsState } from './trendCusorSlice';
import { ConfigState, createConfigSlice, Flags } from './config';

export type StateData = TrendCursorsState & ConfigState;
const useDataStore = create<StateData>()(
  devtools((...args) => ({
    ...createTrendCursorsSlice(...args),
    ...createConfigSlice(...args),
  }))
);

export default useDataStore;

export const getConfigValue = (configName: Flags) => useDataStore((state) => state.config[configName]);
