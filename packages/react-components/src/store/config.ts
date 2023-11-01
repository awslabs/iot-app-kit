import { StateCreator } from 'zustand/esm';

export type Flags = 'useEcharts' | 'useCSVDownload';
export interface ConfigState {
  config: Record<Flags, boolean>;
}
export const createConfigSlice: StateCreator<ConfigState> = () => ({
  config: {
    useEcharts: !!localStorage?.getItem('USE_ECHARTS'),
    useCSVDownload: !!localStorage?.getItem('USE_CSV_DOWNLOAD'),
  },
});
