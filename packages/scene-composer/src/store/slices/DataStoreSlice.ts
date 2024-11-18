import { type GetState, type SetState, type StoreApi } from 'zustand';

import { type IDataInput, type IDataBindingTemplate } from '../../interfaces';
import { type RootState } from '../Store';

export interface IDataStoreSlice {
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;

  setDataInput: (dataInput?: IDataInput) => void;
  setDataBindingTemplate: (dataBindingTemplate: IDataBindingTemplate) => void;
}

export const createDataStoreSlice = (
  set: SetState<RootState>,
  _get: GetState<RootState>,
  _api: StoreApi<RootState>,
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
});
