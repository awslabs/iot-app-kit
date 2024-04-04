import { SliceCreator } from '../middlewares';

export interface INodeErrorStateSlice {
  nodeErrorMap: { [nodeRef: string]: string };

  addNodeError: (nodeRef: string, error: string) => void;
  removeNodeError: (nodeRef: string) => void;
}

export const createNodeErrorStateSlice: SliceCreator<keyof INodeErrorStateSlice> = (
  set,
  get,
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
