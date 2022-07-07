import React, { FC, useCallback, useState } from 'react';

import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useChildNodes, useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';

import SceneNodeLabel from './SceneNodeLabel';
import { AcceptableDropTypes, EnhancedTree, EnhancedTreeItem } from './constants';

interface SceneHierarchyTreeItemProps extends ISceneHierarchyNode {
  enableDragAndDrop?: boolean;
  expanded?: boolean;
}

const SceneHierarchyTreeItem: FC<SceneHierarchyTreeItemProps> = ({
  objectRef: key,
  name: labelText,
  componentTypes,
  enableDragAndDrop,
  expanded: defaultExpanded = true,
}: SceneHierarchyTreeItemProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [childNodes] = useChildNodes(key);

  const { selected, select, unselect, activate, move, selectionMode } = useSceneHierarchyData();

  // istanbul ignore next
  const onExpandNode = useCallback((expanded) => {
    setExpanded(expanded);
  }, []);

  const onToggle = useCallback(
    (newState: boolean) => {
      newState ? select(key) : unselect(key);
    },
    [selected, select, unselect],
  );

  const onActivated = useCallback(() => {
    activate(key);
    select(key);
  }, []);

  const dropHandler = useCallback<DropHandler<{ ref: string }>>(
    // istanbul ignore next
    (item: { ref: string }, { beenHandled }) => {
      // istanbul ignore next
      if (!beenHandled) {
        move(item.ref, key);
      }
    },
    [key],
  );

  return (
    <EnhancedTreeItem
      key={key}
      labelText={<SceneNodeLabel labelText={labelText} componentTypes={componentTypes} />}
      onExpand={onExpandNode}
      expanded={expanded}
      expandable={childNodes.length > 0}
      selected={selected.has(key)}
      selectionMode={selectionMode}
      onSelected={onToggle}
      onActivated={onActivated}
      acceptDrop={AcceptableDropTypes}
      onDropped={dropHandler}
      draggable={enableDragAndDrop}
      dataType={componentTypes && componentTypes.length > 0 ? componentTypes[0] : /* istanbul ignore next */ 'default'} // TODO: This is somewhat based on the current assumption that items will currently only really have one componentType
      data={{ ref: key }}
    >
      {childNodes && expanded && (
        <EnhancedTree droppable={enableDragAndDrop} acceptDrop={AcceptableDropTypes} onDropped={dropHandler}>
          {childNodes.map((node) => {
            return <SceneHierarchyTreeItem key={node.objectRef} enableDragAndDrop={enableDragAndDrop} {...node} />;
          })}
        </EnhancedTree>
      )}
    </EnhancedTreeItem>
  );
};

SceneHierarchyTreeItem.displayName = 'SceneNodeTreeItem';

export default SceneHierarchyTreeItem;
