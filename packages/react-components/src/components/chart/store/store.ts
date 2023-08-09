import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createHighlightedDataStreamsSlice, HighlightedDataSteamsState } from './highlightedDataStreams';

export type StateData = HighlightedDataSteamsState;
export const createChartStore = () =>
  create<StateData>()(
    devtools((...args) => ({
      ...createHighlightedDataStreamsSlice(...args),
    }))
  );
