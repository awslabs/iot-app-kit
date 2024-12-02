import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Position } from '../types';

export interface ContextMenuState {
  position: Position | undefined;
}

export interface ContextMenuActions {
  open: ({ position }: { position: Position }) => void;
  close: VoidFunction;
}

export const useContextMenu = create<ContextMenuState & ContextMenuActions>()(
  immer((set) => ({
    position: undefined,

    open: ({ position }) => {
      set((state) => {
        state.position = position;
      });
    },

    close: () => {
      set((state) => {
        state.position = undefined;
      });
    },
  }))
);
