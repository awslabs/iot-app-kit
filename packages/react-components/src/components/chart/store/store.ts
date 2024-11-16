import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMultiYAxisSlice, type MultiYAxisState } from './multiYAxis';
import {
  createDataStreamsSlice,
  type DataStreamsState,
} from './contextDataStreams';
import { createMinMaxSlice, type MinMaxState } from './dataStreamMinMaxStore';

export type StateData = DataStreamsState &
  MultiYAxisState &
  MinMaxState & { chartId: string };

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
          ...createMinMaxSlice(...args),
        }),
        { name: `chart-store-${initProps?.chartId}` }
      )
    )
  );
