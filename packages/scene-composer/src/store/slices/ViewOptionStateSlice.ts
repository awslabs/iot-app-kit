import { SetState } from 'zustand';

import { ITagSettings } from '../../interfaces';
import { RootState } from '../Store';

export interface IViewOptionStateSlice {
  motionIndicatorVisible: boolean;
  tagSettings?: ITagSettings;
  enableMatterportViewer?: boolean;

  toggleMotionIndicatorVisibility: () => void;
  setTagSettings: (settings: ITagSettings) => void;
  setMatterportViewerEnabled: (isEnabled: boolean) => void;
}

export const createViewOptionStateSlice = (set: SetState<RootState>): IViewOptionStateSlice => ({
  motionIndicatorVisible: true,
  tagSettings: undefined,
  enableMatterportViewer: false,

  toggleMotionIndicatorVisibility: () => {
    set((draft) => {
      draft.noHistoryStates.motionIndicatorVisible = !draft.noHistoryStates.motionIndicatorVisible;
      draft.lastOperation = 'toggleMotionIndicatorVisibility';
    });
  },
  setTagSettings: (settings) => {
    set((draft) => {
      draft.noHistoryStates.tagSettings = settings;
      draft.lastOperation = 'setTagSettings';
    });
  },
  setMatterportViewerEnabled: (enabled: boolean) => {
    set((draft) => {
      draft.noHistoryStates.enableMatterportViewer = enabled;
      draft.lastOperation = 'setMatterportViewerEnabled';
    });
  },
});
