import { createSlice } from '@reduxjs/toolkit';
import type { Mode } from './types';

export type ModeState = Mode;

export const initialState: ModeState = 'view' as Mode;

export const {
  reducer,
  actions: { enterEditMode, exitEditMode },
} = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    enterEditMode: () => {
      return 'edit' as Mode;
    },

    exitEditMode: () => {
      return 'view' as Mode;
    },
  },
});
