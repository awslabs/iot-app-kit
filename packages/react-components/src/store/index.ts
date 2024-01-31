import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ConfigState, createConfigSlice, Flags } from './config';
import { ChartStoreState, createChartStoresSlice } from './chartStoreSlice';
import {
  createTrendCursorsSlice,
  TrendCursorGrouping,
  TrendCursorGroupingMap,
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
        partialize: (state) => ({
          ...state,
          // chart stores are zustand store instances that
          // are persisted on their own and do not
          // nned to be serialized
          chartStores: {},
          groups: Object.entries(state.groups).reduce<TrendCursorGroupingMap>(
            (groups, [groupId, grouping]) => {
              const groupingWithoutConnected: TrendCursorGrouping = {
                ...grouping,
                // connectedCharts are a list of callback functions
                // they cannot be and don't need to be serialized
                connectedCharts: [],
              };
              groups[groupId] = groupingWithoutConnected;
              return groups;
            },
            {}
          ),
        }),
      }
    )
  )
);

export default useDataStore;

export const useGetConfigValue = (configName: Flags) =>
  useDataStore((state) => state.config[configName]);
