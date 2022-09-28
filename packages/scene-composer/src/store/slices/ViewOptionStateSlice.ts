import { GetState, SetState, StoreApi } from 'zustand';

import { RootState } from '../Store';

export interface IViewOptionStateSlice {
  motionIndicatorVisible: boolean;

  toggleMotionIndicatorVisibility: () => void;
}

export const createViewOptionStateSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>,
  api: StoreApi<RootState>,
): IViewOptionStateSlice => ({
  motionIndicatorVisible: true,

  toggleMotionIndicatorVisibility: () => {
    set((draft) => {
      draft.noHistoryStates.motionIndicatorVisible = !draft.noHistoryStates.motionIndicatorVisible;
      draft.lastOperation = 'toggleMotionIndicatorVisibility';
    });
  },
});
