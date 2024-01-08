import React, {
  createContext,
  useRef,
  PropsWithChildren,
  useEffect,
} from 'react';
import { createChartStore } from './store';
import useDataStore from '../../../store';

// Recommended usage from zustand https://docs.pmnd.rs/zustand/previous-versions/zustand-v3-create-context
export const ChartStoreContext = createContext<
  ReturnType<typeof createChartStore>
>(createChartStore());

export const ChartStoreProvider = ({
  id,
  children,
}: PropsWithChildren<{ id: string }>) => {
  const storeRef = useRef<ReturnType<typeof createChartStore>>();
  useEffect(
    () => () => {
      // cleanup chart store after we dispose the chart component
      useDataStore.getState().removeChart(id);
    },
    [id]
  );
  if (!storeRef.current) {
    const storeState = useDataStore.getState();
    const stores = storeState.chartStores;
    let store = stores[id];
    if (!store) store = storeState.addChart(id);
    storeRef.current = store;
  }
  return (
    <ChartStoreContext.Provider value={storeRef.current}>
      {children}
    </ChartStoreContext.Provider>
  );
};
