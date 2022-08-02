import { createContext, useContext } from 'react';
import { Object3D, Event } from 'three';

interface ModelExplorerState {
  object3D?: Object3D<Event>;
}

const ModelExplorerContext = createContext<ModelExplorerState>({});

export const useModelExplorer = () => {
  return useContext(ModelExplorerContext);
};

export default ModelExplorerContext;
