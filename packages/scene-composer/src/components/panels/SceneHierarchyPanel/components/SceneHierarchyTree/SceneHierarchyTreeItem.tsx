import React, { FC, useCallback, useState } from 'react';
import { Object3D } from 'three';

import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';
import SubModelTree from '../SubModelTree';
import { KnownComponentType } from '../../../../../interfaces';
import { IModelRefComponentInternal } from '../../../../../store';
import { ModelType } from '../../../../../models/SceneModels';

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
  childRefs = [],
  expanded: defaultExpanded = true,
}: SceneHierarchyTreeItemProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const {
    selected,
    select,
    unselect,
    getChildNodes,
    activate,
    move,
    selectionMode,
    getObject3DBySceneNodeRef,
    isViewing,
  } = useSceneHierarchyData();

  const model = getObject3DBySceneNodeRef(key) as Object3D | undefined;

  const isValidModelRef = componentTypes?.find(
    (type) =>
      type === KnownComponentType.ModelRef &&
      (type as unknown as IModelRefComponentInternal)?.modelType !== ModelType.Environment,
  );

  const showSubModel = isValidModelRef && !!model && !isViewing();

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

  return (
    <EnhancedTreeItem
      key={key}
      labelText={<SceneNodeLabel objectRef={key} labelText={labelText} componentTypes={componentTypes} />}
      onExpand={onExpandNode}
      expanded={expanded}
      expandable={childRefs.length > 0}
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
      {expanded && (
        <EnhancedTree droppable={enableDragAndDrop} acceptDrop={AcceptableDropTypes} onDropped={dropHandler}>
          {childRefs.length > 0 &&
            getChildNodes(key).map((node) => (
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
