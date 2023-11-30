import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createHighlightedDataStreamsSlice, HighlightedDataSteamsState } from './highlightedDataStreams';
import { createMultiYAxisSlice, MultiYAxisState } from './multiYAxis';

export type StateData = HighlightedDataSteamsState & MultiYAxisState;
export const createChartStore = () =>
  create<StateData>()(
    devtools((...args) => ({
      ...createHighlightedDataStreamsSlice(...args),
      ...createMultiYAxisSlice(...args),
    }))
  );
