import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PayloadFromActionCreator } from '~/store';
import type { Position } from '~/types';

export interface ContextMenuState {
  position: Position | undefined;
}

export const initialContextMenuState: ContextMenuState = {
  position: undefined,
};

export const {
  reducer: contextMenuReducer,
  actions: { openContextMenu, closeContextMenu },
} = createSlice({
  name: 'context menu',
  initialState: initialContextMenuState,
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

export type OpenContextMenu = typeof openContextMenu;
export type OpenContextMenuPayload = PayloadFromActionCreator<OpenContextMenu>;
export type CloseContextMenu = typeof closeContextMenu;
export type CloseContextMenuPayload =
  PayloadFromActionCreator<CloseContextMenu>;
