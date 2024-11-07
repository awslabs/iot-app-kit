import { type StateCreator } from 'zustand';
import { DEFAULT_TREND_CURSOR_DATA, type TrendCursorsState } from './state';
import { reducer } from './reducer';

export const createTrendCursorsSlice: StateCreator<TrendCursorsState> = (
  set
) => ({
  ...DEFAULT_TREND_CURSOR_DATA,
  trendCursorsDispatch: (args) => set((state) => reducer(state, args)),
});
