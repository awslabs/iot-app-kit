import { GetState, SetState, StoreApi } from 'zustand';

import { IDataInput, IDataBindingTemplate, PropertyDecoderFunctionMap } from '../../interfaces';
import { RootState } from '../Store';

export interface IDataStoreSlice {
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;
  propertyDecoders?: PropertyDecoderFunctionMap;
  playbackCursor?: number;
  playbackSpeed?: number;
  setDataInput: (dataInput?: IDataInput) => void;
  setDataBindingTemplate: (dataBindingTemplate: IDataBindingTemplate) => void;
  setPropertyDecoders: (decoders: PropertyDecoderFunctionMap) => void;
  setPlaybackCursor: (playbackCursor: number) => void;
  incrementPlaybackCursor: (delta: number) => void;
  setPlaybackSpeed: (playbackSpeed: number) => void;
}

export const createDataStoreSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>,
  api: StoreApi<RootState>,
): IDataStoreSlice => ({
  dataInput: undefined,

  setDataInput: (dataInput) => {
    set((draft) => {
      draft.dataInput = dataInput;
      draft.lastOperation = 'setDataInput';
    });
  },

  setDataBindingTemplate: (dataBindingTemplate) => {
    set((draft) => {
      draft.dataBindingTemplate = dataBindingTemplate;
      draft.lastOperation = 'setDataBindingTemplate';
    });
  },

  setPropertyDecoders: (decoders) => {
    set((draft) => {
      draft.propertyDecoders = decoders;
      draft.lastOperation = 'setPropertyDecoders';
    });
  },

  setPlaybackCursor: (playbackCursor) => {
    set((draft) => {
      draft.playbackCursor = playbackCursor;
      draft.lastOperation = 'setPlaybackCursor';
    });
  },

  incrementPlaybackCursor: (delta) => {
    set((draft) => {
      draft.playbackCursor = (draft.playbackCursor ?? 0) + delta;
      const maxVal = (draft.dataInput?.timeRange?.to ?? 0) - (draft.dataInput?.timeRange?.from ?? 0);
      if (draft.playbackCursor >= maxVal) {
        draft.playbackCursor = 0;
      }
      draft.lastOperation = 'setPlaybackCursor';
    });
  },

  setPlaybackSpeed: (playbackSpeed) => {
    set((draft) => {
      draft.playbackSpeed = playbackSpeed;
      draft.lastOperation = 'setPlaybackSpeed';
    });
  },
});
