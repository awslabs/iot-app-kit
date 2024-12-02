import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '../../configuration/createSelectors';

export type ViewMode = 'view';
export type EditMode = 'edit';
export type Mode = ViewMode | EditMode;

export interface ModeState {
  mode: Mode;
}

export interface ModeActions {
  selectMode: (params: { mode: Mode }) => void;
}

export const useMode = createSelectors(
  create<ModeState & ModeActions>()(
    immer((set) => ({
      mode: 'view',

      selectMode: ({ mode }) => {
        set((state) => {
          state.mode = mode;
        });
      },
    }))
  )
);
