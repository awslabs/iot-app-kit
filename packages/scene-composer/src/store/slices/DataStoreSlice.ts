import { GetState, SetState, StoreApi } from 'zustand';

import { IDataInput, IDataBindingTemplate, PropertyDecoderFunction } from '../../interfaces';
import { RootState } from '../Store';

export interface IDataStoreSlice {
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;
  propertyDecoders?: PropertyDecoderFunction;
  setDataInput: (dataInput?: IDataInput) => void;
  setDataBindingTemplate: (dataBindingTemplate: IDataBindingTemplate) => void;
  setPropertyDecoders: (decoders: PropertyDecoderFunction) => void;
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
});
