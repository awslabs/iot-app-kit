import * as React from 'react';

export const sceneComposerIdContext = React.createContext('default');

export const useSceneComposerId = (): string => {
  return React.useContext(sceneComposerIdContext);
};
