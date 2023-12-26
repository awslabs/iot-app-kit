import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMultiYAxisSlice, MultiYAxisState } from './multiYAxis';
import { createDataStreamsSlice, DataStreamsState } from './contextDataStreams';

export type StateData = DataStreamsState & MultiYAxisState;
export const createChartStore = () =>
  create<StateData>()(
    devtools(
      persist(
        (...args) => ({
          ...createMultiYAxisSlice(...args),
          ...createDataStreamsSlice(...args),
        }),
        { name: 'chartStore' }
      )
    )
  );
