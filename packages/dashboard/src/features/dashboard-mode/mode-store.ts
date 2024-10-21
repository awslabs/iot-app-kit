import { createSlice } from '@reduxjs/toolkit';

export type EditMode = 'edit';
export type ViewMode = 'view';
export type Mode = ViewMode | EditMode;

export type ModeState = Mode;

export const initialState: ModeState = 'view' as Mode;

export const {
  reducer: modeReducer,
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
