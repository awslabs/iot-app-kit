import { StateCreator } from 'zustand/esm';

export type Flags = 'useEcharts' | 'useCSVDownload' | 'useModelBasedQuery';
export interface ConfigState {
  config: Record<Flags, boolean>;
}
export const createConfigSlice: StateCreator<ConfigState> = () => ({
  config: {
    useEcharts: !!localStorage?.getItem('USE_ECHARTS'),
    useCSVDownload: !!localStorage?.getItem('USE_CSV_DOWNLOAD'),
    useModelBasedQuery: !!localStorage?.getItem('USE_MODEL_BASED_QUERY'),
  },
});
