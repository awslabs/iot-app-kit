import React from 'react';

import useSelectedNode from '../../../hooks/useSelectedNode';

import ModelExplorerLayout from './Layout';
import ModelExplorerContext from './Context';
import ModelExplorerTreeView from './ModelExplorerTreeView';

const ModelExplorerPanel = () => {
  const { getSelectedObject } = useSelectedNode();
  const scene = getSelectedObject();

  // istanbul ignore next: nullish
  const object3D = scene?.getObjectByName('Scene') || scene;

  return (
    <ModelExplorerLayout active={!!scene}>
      <ModelExplorerContext.Provider
        value={{
          object3D,
        }}
      >
        <ModelExplorerTreeView />
      </ModelExplorerContext.Provider>
    </ModelExplorerLayout>
  );
};

export default ModelExplorerPanel;
