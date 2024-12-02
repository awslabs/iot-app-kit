import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EditMode, Mode, ViewMode } from './useMode';

export type ViewModePanelType = 'assistant';
export type EditModePanelType = 'resources' | 'customization' | 'settings';
export type PanelOrientation = 'right' | 'left' | 'bottom';

export interface ModePanelState<PanelType extends string> {
  orientation: PanelOrientation;
  panelType: PanelType | undefined;
}

type ViewModePanelState = Record<ViewMode, ModePanelState<ViewModePanelType>>;
type EditModePanelState = Record<EditMode, ModePanelState<EditModePanelType>>;

export type PanelState = ViewModePanelState & EditModePanelState;

export type OpenPanel = <M extends Mode>(params: {
  mode: M;
  panelType: PanelState[Mode]['panelType'];
}) => void;

export type ClosePanel = (params: { mode: Mode }) => void;

export type ReorientPanel = (params: {
  mode: Mode;
  orientation: PanelOrientation;
}) => void;

export interface PanelActions {
  open: OpenPanel;
  close: ClosePanel;
  reorient: ReorientPanel;
}

export const usePanels = create<PanelState & PanelActions>()(
  immer((set) => ({
    view: {
      panelType: undefined,
      orientation: 'right',
    },
    edit: {
      panelType: undefined,
      orientation: 'right',
    },

    open: ({ mode, panelType }) => {
      set((state) => {
        state[mode].panelType = panelType;
      });
    },

    close: ({ mode }) => {
      set((state) => {
        state[mode].panelType = undefined;
      });
    },

    reorient: ({ mode, orientation }) => {
      set((state) => {
        state[mode].orientation = orientation;
      });
    },
  }))
);
