import React, { FC, useCallback, useContext, useState } from 'react';
import { Object3D } from 'three';

import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useChildNodes, useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';
import SubModelTree from '../SubModelTree';
import { useNodeErrorState, useStore } from '../../../../../store';
import { sceneComposerIdContext, useSceneComposerId } from '../../../../../common/sceneComposerIdContext';
import { isEnvironmentNode } from '../../../../../utils/nodeUtils';

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
  const [visible, setVisible] = useState(true);
  const [childNodes] = useChildNodes(key);

  const { selected, select, unselect, activate, move, show, hide, remove, selectionMode, getObject3DBySceneNodeRef } =
    useSceneHierarchyData();
  const { nodeErrorMap } = useNodeErrorState(useContext(sceneComposerIdContext));

  const model = getObject3DBySceneNodeRef(key) as Object3D | undefined;
  const sceneComposerId = useSceneComposerId();
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing);
  const node = useStore(sceneComposerId)((state) => state.getSceneNodeByRef(key));

  const showSubModel = !isEnvironmentNode(node) && !!model && !isViewing();

  const onExpandNode = useCallback((expanded) => {
    setExpanded(expanded);
  }, []);

  const onToggle = useCallback(
    (newState: boolean) => {
      newState ? select(key) : unselect(key);
    },
    [selected, select, unselect, key],
  );

  const onActivated = useCallback(() => {
    activate(key);
    select(key);
  }, [key]);

  const dropHandler = useCallback<DropHandler<{ ref: string }>>(
    (item: { ref: string }, { beenHandled }) => {
      if (!beenHandled) {
        move(item.ref, key);
      }
    },
    [key],
  );

  const onVisibilityChange = useCallback(
    (newVisibility) => {
      if (newVisibility) {
        show(key);
      } else {
        hide(key);
      }

      setVisible(newVisibility);
    },
    [key, visible, show, hide],
  );

  const onDelete = useCallback(() => {
    remove(key);
  }, [key]);

  return (
    <EnhancedTreeItem
      key={key}
      labelText={
        <SceneNodeLabel
          labelText={labelText}
          componentTypes={componentTypes}
          error={nodeErrorMap[key]}
          visible={visible}
          onVisibilityChange={onVisibilityChange}
          onDelete={onDelete}
        />
      }
      onExpand={onExpandNode}
      expanded={expanded}
      expandable={childNodes.length > 0}
      selected={selected === key}
      selectionMode={selectionMode}
      onSelected={isViewing() ? onActivated : onToggle}
      onActivated={onActivated}
      acceptDrop={AcceptableDropTypes}
      onDropped={dropHandler}
      draggable={enableDragAndDrop && !isViewing()}
      dataType={componentTypes && componentTypes.length > 0 ? componentTypes[0] : /* istanbul ignore next */ 'default'} // TODO: This is somewhat based on the current assumption that items will currently only really have one componentType
      data={{ ref: key }}
    >
      {childNodes && expanded && (
        <EnhancedTree droppable={enableDragAndDrop} acceptDrop={AcceptableDropTypes} onDropped={dropHandler}>
          {childNodes.map((node) => (
            <SceneHierarchyTreeItem key={node.objectRef} enableDragAndDrop={enableDragAndDrop} {...node} />
          ))}
          {showSubModel && <SubModelTree parentRef={key} expanded={false} object3D={model!} selectable />}
        </EnhancedTree>
      )}
    </EnhancedTreeItem>
  );
};

SceneHierarchyTreeItem.displayName = 'SceneNodeTreeItem';

export default SceneHierarchyTreeItem;
