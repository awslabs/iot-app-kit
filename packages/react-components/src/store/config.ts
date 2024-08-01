import { StateCreator } from 'zustand/esm';

export type Flags = 'useModelBasedQuery';
export interface ConfigState {
  config: Record<Flags, boolean>;
  timeZone?: string;
}
export const createConfigSlice: StateCreator<ConfigState> = () => ({
  config: {
    useModelBasedQuery: !!localStorage?.getItem('USE_MODEL_BASED_QUERY'),
  },
});
