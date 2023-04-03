import { SetState } from 'zustand';

import { ITagSettings, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { RootState } from '../Store';

export interface IViewOptionStateSlice {
  componentVisibilities: Partial<{
    [key in KnownComponentType | Component.DataOverlaySubType]: boolean;
  }>;
  tagSettings?: ITagSettings;

  toggleComponentVisibility: (componentType: KnownComponentType | Component.DataOverlaySubType) => void;
  setTagSettings: (settings: ITagSettings) => void;
}

export const createViewOptionStateSlice = (set: SetState<RootState>): IViewOptionStateSlice => ({
  componentVisibilities: {
    [KnownComponentType.MotionIndicator]: true,
    [KnownComponentType.Tag]: true,
    [Component.DataOverlaySubType.TextAnnotation]: true,
  },
  tagSettings: undefined,

  toggleComponentVisibility: (componentType) => {
    set((draft) => {
      draft.noHistoryStates.componentVisibilities[componentType] =
        !draft.noHistoryStates.componentVisibilities[componentType];
      draft.lastOperation = 'toggleComponentVisibility';
    });
  },
  setTagSettings: (settings) => {
    set((draft) => {
      draft.noHistoryStates.tagSettings = settings;
      draft.lastOperation = 'setTagSettings';
    });
  },
});
