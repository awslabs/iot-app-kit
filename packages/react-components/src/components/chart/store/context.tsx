import React, { createContext, useRef, PropsWithChildren } from 'react';
import { createChartStore } from './store';

// Recommended usage from zustand https://docs.pmnd.rs/zustand/previous-versions/zustand-v3-create-context
export const ChartStoreContext = createContext(createChartStore());

export const ChartStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<ReturnType<typeof createChartStore>>();
  if (!storeRef.current) storeRef.current = createChartStore();
  return <ChartStoreContext.Provider value={storeRef.current}>{children}</ChartStoreContext.Provider>;
};
