import { GetState, SetState, StoreApi } from 'zustand';

import { ITagSettings } from '../../interfaces';
import { RootState } from '../Store';

export interface IViewOptionStateSlice {
  motionIndicatorVisible: boolean;
  tagSettings?: ITagSettings;

  toggleMotionIndicatorVisibility: () => void;
  setTagSettings: (settings: ITagSettings) => void;
}

export const createViewOptionStateSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>,
  api?: StoreApi<RootState>,
): IViewOptionStateSlice => ({
  motionIndicatorVisible: true,
  tagSettings: undefined,

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
});
