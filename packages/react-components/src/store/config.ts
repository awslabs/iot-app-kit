import { type StateCreator } from 'zustand';

export type Flags = 'useModelBasedQuery' | 'useAlarms';
export interface ConfigState {
  config: Record<Flags, boolean>;
  timeZone?: string;
}
export const createConfigSlice: StateCreator<ConfigState> = () => ({
  config: {
    useModelBasedQuery: !!localStorage?.getItem('USE_MODEL_BASED_QUERY'),
    useAlarms: true,
  },
});
