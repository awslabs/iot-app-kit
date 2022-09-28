import React, { FC, useCallback } from 'react';

import { useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';

import { AcceptableDropTypes, EnhancedTree } from './constants';
import SceneHierarchyTreeItem from './SceneHierarchyTreeItem';

interface SceneHierarchyTreeProps {
  enableDragAndDrop: boolean;
}

const SceneHierarchyTree: FC<SceneHierarchyTreeProps> = ({ enableDragAndDrop }: SceneHierarchyTreeProps) => {
  const { rootNodes, move } = useSceneHierarchyData();

  const dropHandler = useCallback<DropHandler<{ ref: string }>>((item: { ref: string }, { beenHandled }) => {
    if (!beenHandled) {
      move(item.ref);
    }
  }, []);

  return (
    <EnhancedTree acceptDrop={AcceptableDropTypes} onDropped={dropHandler} droppable={enableDragAndDrop}>
      {rootNodes.map((root) => (
        <SceneHierarchyTreeItem key={root.objectRef} enableDragAndDrop={enableDragAndDrop} {...root} />
      ))}
    </EnhancedTree>
  );
};

SceneHierarchyTree.displayName = 'SceneHierarchyTree';

export default SceneHierarchyTree;
