import { type Viewport } from '@iot-app-kit/core';

import { type Draft } from 'immer';
import { type ITagSettings, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { type RootState } from '../Store';

export interface IViewOptionStateSlice {
  componentVisibilities: Partial<{
    [key in KnownComponentType | Component.DataOverlaySubType]: boolean;
  }>;
  viewport?: Viewport;
  dataBindingQueryRefreshRate?: number;
  autoQueryEnabled?: boolean;
  tagSettings?: ITagSettings;
  connectionNameForMatterportViewer?: string;

  setViewport: (viewport?: Viewport) => void;
  setDataBindingQueryRefreshRate: (dataBindingQueryRefreshRate?: number) => void;
  setAutoQueryEnabled: (autoQueryEnabled: boolean) => void;
  toggleComponentVisibility: (componentType: KnownComponentType | Component.DataOverlaySubType) => void;
  setTagSettings: (settings: ITagSettings) => void;
  setConnectionNameForMatterportViewer: (connectionName?: string) => void;
}

type SetState = (cb: (draft: Draft<RootState>) => void) => void;

export const createViewOptionStateSlice = (set: SetState) => ({
  componentVisibilities: {
    [KnownComponentType.MotionIndicator]: true,
    [KnownComponentType.Tag]: true,
    [Component.DataOverlaySubType.TextAnnotation]: true,
  },
  tagSettings: undefined,
  connectionNameForMatterportViewer: undefined,

  setViewport: (viewport) => {
    set((draft) => {
      draft.noHistoryStates.viewport = viewport;
      draft.lastOperation = 'setViewport';
    });
  },
  setDataBindingQueryRefreshRate: (rate) => {
    set((draft) => {
      draft.noHistoryStates.dataBindingQueryRefreshRate = rate;
      draft.lastOperation = 'setDataBindingQueryRefreshRate';
    });
  },
  setAutoQueryEnabled: (autoQueryEnabled) => {
    set((draft) => {
      draft.noHistoryStates.autoQueryEnabled = autoQueryEnabled;
      draft.lastOperation = 'setAutoQueryEnabled';
    });
  },
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
  setConnectionNameForMatterportViewer: (connectionName?: string) => {
    set((draft) => {
      draft.noHistoryStates.connectionNameForMatterportViewer = connectionName;
      draft.lastOperation = 'setConnectionNameForMatterportViewer';
    });
  },
});
