import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EditMode, Mode, ViewMode } from '~/features/dashboard-mode';

export type ViewModePanelType = 'assistant';
export type EditModePanelType = 'resources' | 'customization' | 'settings';
export type PanelOrientation = 'right' | 'left' | 'bottom';

interface ModePanelState<PanelType extends string> {
  orientation: PanelOrientation;
  panelType: PanelType | undefined;
}

type ViewModePanelState = Record<ViewMode, ModePanelState<ViewModePanelType>>;
type EditModePanelState = Record<EditMode, ModePanelState<EditModePanelType>>;

export type PanelState = ViewModePanelState & EditModePanelState;

export const initialPanelState: PanelState = {
  view: {
    panelType: undefined,
    orientation: 'right',
  },
  edit: {
    panelType: undefined,
    orientation: 'right',
  },
};

export const {
  name: panelReducerName,
  reducer: panelReducer,
  actions: { openPanel, closePanel, changeOrientation },
} = createSlice({
  name: 'panels',
  initialState: initialPanelState,
  reducers: {
    openPanel: <Mode extends ViewMode | EditMode>(
      state: PanelState,
      action: PayloadAction<{
        mode: Mode;
        panelType: PanelState[Mode]['panelType'];
      }>
    ) => {
      state[action.payload.mode].panelType = action.payload.panelType;
    },

    closePanel: (
      state,
      action: PayloadAction<{ mode: ViewMode | EditMode }>
    ) => {
      state[action.payload.mode].panelType = undefined;
    },

    changeOrientation: (
      state,
      {
        payload: { mode, orientation },
      }: PayloadAction<{ mode: Mode; orientation: PanelOrientation }>
    ) => {
      state[mode].orientation = orientation;
    },
  },
});
