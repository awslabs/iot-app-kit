import { StateCreator } from 'zustand/esm';

export type Flags = 'useModelBasedQuery' | 'showTanstackTable';
export interface ConfigState {
  config: Record<Flags, boolean>;
}
export const createConfigSlice: StateCreator<ConfigState> = () => ({
  config: {
    useModelBasedQuery: !!localStorage?.getItem('USE_MODEL_BASED_QUERY'),
    showTanstackTable: localStorage?.getItem('SHOW_LEGEND_TANSTACK_TABLE') === 'true',
  },
});
