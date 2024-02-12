import { SetState, GetState, StoreApi } from 'zustand';

import { RootState } from '..';
import { INodeEntityCommand } from '../internalInterfaces';

export interface INodeEntityCommandStateSlice {
  nodeEntityCommandMap: { [nodeRef: string]: INodeEntityCommand };

  getNodeEntityCommandMap: () => { [nodeRef: string]: INodeEntityCommand };
  addNodeEntityCommand: (nodeRef: string, nodeEntityCommand: INodeEntityCommand) => void;
  clearNodeEntityCommandMap: () => void;
}

export const createNodeEntityCommandStateSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>,
  _api: StoreApi<RootState>,
): INodeEntityCommandStateSlice => ({
  nodeEntityCommandMap: {},

  getNodeEntityCommandMap: () => {
    return get().nodeEntityCommandMap;
  },

  addNodeEntityCommand: (nodeRef: string, nodeEntityCommand: INodeEntityCommand) => {
    set((draft) => {
      const currentNodeEntityCommandMap = { ...draft.nodeEntityCommandMap };
      currentNodeEntityCommandMap[nodeRef] = nodeEntityCommand;
      draft.nodeEntityCommandMap = currentNodeEntityCommandMap;
    });
  },

  clearNodeEntityCommandMap: () => {
    set((draft) => {
      let currentNodeEntityCommandMap = { ...draft.nodeEntityCommandMap };
      currentNodeEntityCommandMap = {};
      draft.nodeEntityCommandMap = currentNodeEntityCommandMap;
    });
  },
});
