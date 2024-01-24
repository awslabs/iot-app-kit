import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMultiYAxisSlice, MultiYAxisState } from './multiYAxis';
import { createDataStreamsSlice, DataStreamsState } from './contextDataStreams';

export type StateData = DataStreamsState &
  MultiYAxisState & { chartId: string };

export const createChartStore = (
  initProps: Partial<StateData> & Required<Pick<Partial<StateData>, 'chartId'>>
) =>
  create<StateData>()(
    devtools(
      persist(
        (...args) => ({
          ...initProps,
          ...createMultiYAxisSlice(...args),
          ...createDataStreamsSlice(...args),
        }),
        { name: `chart-store-${initProps?.chartId}` }
      )
    )
  );
