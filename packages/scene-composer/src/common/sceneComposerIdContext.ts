import { createContext, useContext } from 'react';

export const sceneComposerIdContext = createContext('default');

export const useSceneComposerId = (): string => {
  return useContext(sceneComposerIdContext);
};
