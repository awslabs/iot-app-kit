import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { DashboardConfiguration, DashboardSave } from '../../types';

export interface SavingState {
  status: 'idle' | 'saving' | 'error';
}

export interface SavingActions {
  save: (params: {
    dashboardConfiguration: DashboardConfiguration;
    onSave: DashboardSave;
  }) => Promise<void>;
}

export const useSaving = create<SavingState & SavingActions>()(
  immer((set) => ({
    status: 'idle',

    save: async ({ dashboardConfiguration, onSave }) => {
      set((state) => {
        state.status = 'saving';
      });

      try {
        await onSave(dashboardConfiguration);

        set((state) => {
          state.status = 'idle';
        });
      } catch (error) {
        set((state) => {
          state.status = 'error';
        });
      }
    },
  }))
);
