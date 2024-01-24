import { StateCreator } from 'zustand/esm';
import { createChartStore } from '../components/chart/store/store';

export interface ChartStoreData {
  chartStores: Record<string, ReturnType<typeof createChartStore>>;
}

export interface ChartStoreState extends ChartStoreData {
  addChart: (id: string) => ReturnType<typeof createChartStore>;
  removeChart: (id: string) => void;
}

export const createChartStoresSlice: StateCreator<ChartStoreState> = (set) => ({
  chartStores: {},
  addChart: (id) => {
    const store = createChartStore({ chartId: id }); //repopulate chart store from local storage
    set((state) => ({
      chartStores: {
        ...state.chartStores,
        [id]: store,
      },
    }));
    return store;
  },
  removeChart: (id) =>
    set((state) => {
      const storesCopy = { ...state.chartStores };
      delete storesCopy[id];
      return {
        chartStores: storesCopy,
      };
    }),
});
