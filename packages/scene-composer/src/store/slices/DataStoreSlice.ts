import { type StoreApi } from 'zustand';
import { type IDataBindingTemplate, type IDataInput } from '../../interfaces';
import { type RootState } from '../Store';

export interface IDataStoreSlice {
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;

  setDataInput: (dataInput?: IDataInput) => void;
  setDataBindingTemplate: (dataBindingTemplate: IDataBindingTemplate) => void;
}

export const createDataStoreSlice = (
  set: (cb: (draft: RootState) => void) => void,
  _get: StoreApi<RootState>['getState'],
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
