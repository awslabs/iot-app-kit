import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Position } from '#types';

export interface ContextMenuState {
  position: Position | undefined;
}

export const initialState: ContextMenuState = {
  position: undefined,
};

export const {
  reducer,
  actions: { openContextMenu, closeContextMenu },
} = createSlice({
  name: 'context menu',
  initialState: initialState,
  reducers: {
    openContextMenu: (
      state,
      { payload: { position } }: PayloadAction<{ position: Position }>
    ) => {
      state.position = position;
    },

    closeContextMenu: (state) => {
      state.position = undefined;
    },
  },
});
