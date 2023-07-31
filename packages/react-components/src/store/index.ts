import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createTrendCursorsSlice, TrendCursorsState } from './trendCusorSlice';

export type StateData = TrendCursorsState;
const useDataStore = create<StateData>()(
  devtools((...args) => ({
    ...createTrendCursorsSlice(...args),
  }))
);

export default useDataStore;
