import { type StoreApi } from 'zustand';
import { type RootState } from '../Store';

export interface INodeErrorStateSlice {
  nodeErrorMap: { [nodeRef: string]: string };

  addNodeError: (nodeRef: string, error: string) => void;
  removeNodeError: (nodeRef: string) => void;
}

export const createNodeErrorStateSlice = (
  set: (cb: (draft: RootState) => void) => void,
  get: StoreApi<RootState>['getState'],
  _api: StoreApi<RootState>,
): INodeErrorStateSlice => ({
  nodeErrorMap: {},

  addNodeError: (nodeRef: string, error: string) => {
    const currentNodeErrorMap = { ...get().nodeErrorMap };
    currentNodeErrorMap[nodeRef] = error;
    set((draft) => {
      draft.nodeErrorMap = currentNodeErrorMap;
    });
  },

  removeNodeError: (nodeRef: string) => {
    const currentNodeErrorMap = { ...get().nodeErrorMap };
    delete currentNodeErrorMap[nodeRef];
    set((draft) => {
      draft.nodeErrorMap = currentNodeErrorMap;
    });
  },
});
