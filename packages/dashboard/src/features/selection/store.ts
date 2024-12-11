import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SelectionState {
  selectedWidgetIds: string[];
}

export const initialState: SelectionState = {
  selectedWidgetIds: [],
};

export const {
  reducer,
  actions: { selectWidgets, selectAdditionalWidgets, clearSelection },
} = createSlice({
  name: 'selected widgets',
  initialState,

  reducers: {
    selectWidgets: (state, action: PayloadAction<{ widgetIds: string[] }>) => {
      state.selectedWidgetIds = action.payload.widgetIds;
    },

    selectAdditionalWidgets: (
      state,
      action: PayloadAction<{ widgetIds: string[] }>
    ) => {
      state.selectedWidgetIds = [
        ...new Set([...state.selectedWidgetIds, ...action.payload.widgetIds]),
      ];
    },

    clearSelection: (state) => {
      state.selectedWidgetIds = [];
    },
  },
});
