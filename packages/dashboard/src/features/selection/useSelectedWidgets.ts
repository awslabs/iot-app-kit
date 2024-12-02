import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SelectionState {
  selectedWidgetIds: string[];
}

export interface SelectionActions {
  selectWidgets: (params: { widgetIds: string[] }) => void;
  selectAdditionalWidgets: (params: { widgetIds: string[] }) => void;
  clearSelection: VoidFunction;
}

export const useSelection = create<SelectionState & SelectionActions>()(
  immer((set) => ({
    selectedWidgetIds: [],

    selectWidgets: ({ widgetIds }) => {
      set((state) => {
        state.selectedWidgetIds = widgetIds;
      });
    },

    selectAdditionalWidgets: ({ widgetIds }) => {
      set((state) => {
        state.selectedWidgetIds = [
          ...new Set([...state.selectedWidgetIds, ...widgetIds]),
        ];
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedWidgetIds = [];
      });
    },
  }))
);
