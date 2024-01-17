import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Object3D } from 'three';

import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useChildNodes, useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';
import SubModelTree from '../SubModelTree';
import { KnownComponentType } from '../../../../../interfaces';
import { IModelRefComponentInternal, useSceneDocument } from '../../../../../store';
import { findComponentByType } from '../../../../../utils/nodeUtils';
import { sceneComposerIdContext } from '../../../../../common/sceneComposerIdContext';
import { isDynamicNode } from '../../../../../utils/entityModelUtils/sceneUtils';

import SceneNodeLabel from './SceneNodeLabel';
import { AcceptableDropTypes, EnhancedTree, EnhancedTreeItem } from './constants';

interface SceneHierarchyTreeItemProps extends ISceneHierarchyNode {
  enableDragAndDrop?: boolean;
}

const SceneHierarchyTreeItem: FC<SceneHierarchyTreeItemProps> = ({
  objectRef: key,
  name: labelText,
  componentTypes,
  enableDragAndDrop,
}: SceneHierarchyTreeItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const {
    selected,
    pathFromSelectedToRoot,
    select,
    unselect,
    activate,
    move,
    selectionMode,
    getObject3DBySceneNodeRef,
    isViewing,
  } = useSceneHierarchyData();

  const model = getObject3DBySceneNodeRef(key) as Object3D | undefined;
  const [childNodes] = useChildNodes(key);
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);
  const node = getSceneNodeByRef(key);
  const component = findComponentByType(node, KnownComponentType.ModelRef) as IModelRefComponentInternal;
  const componentRef = component?.ref;
  const showSubModel = useMemo(() => {
    return component && !!model && !isViewing();
  }, [component]);
  const isSubModel = !!findComponentByType(node, KnownComponentType.SubModelRef);
  const isDynamic = isDynamicNode(node);

  const { searchTerms } = useSceneHierarchyData();
  const isSearching = searchTerms !== '';

  useEffect(() => {
    /**
     * Use default state only if node is not expanded
     * If node is already expanded, then skip this
     *  */
    if (!expanded) {
      setExpanded(!!pathFromSelectedToRoot?.includes(key));
    }
  }, [pathFromSelectedToRoot]);

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
      labelNode={<SceneNodeLabel objectRef={key} labelText={labelText} componentTypes={componentTypes} />}
      labelText={labelText}
      onExpand={onExpandNode}
      expanded={expanded}
      expandable={((node && node.childRefs.length > 0) || showSubModel) && !isSearching}
      selected={selected === key}
      selectionMode={selectionMode}
      onSelected={isViewing() ? onActivated : onToggle}
      onActivated={onActivated}
      acceptDrop={isDynamic ? [] : AcceptableDropTypes} // TODO: dynamic scene doesn't support hierarchy yet, disable drag for dynamic node
      onDropped={dropHandler}
      draggable={enableDragAndDrop && !isViewing() && !isSubModel && !isDynamic} // TODO: dynamic scene doesn't support hierarchy yet, disable drag for dynamic node
      dataType={componentTypes && componentTypes.length > 0 ? componentTypes[0] : /* istanbul ignore next */ 'default'} // TODO: This is somewhat based on the current assumption that items will currently only really have one componentType
      data={{ ref: key }}
    >
      {expanded && (
        <EnhancedTree droppable={enableDragAndDrop} acceptDrop={AcceptableDropTypes} onDropped={dropHandler}>
          {childNodes.map((node, index) => (
            <React.Fragment key={index}>
              {!isSearching && (
                <SceneHierarchyTreeItem key={node.objectRef} enableDragAndDrop={enableDragAndDrop} {...node} />
              )}
            </React.Fragment>
          ))}
          {showSubModel && !isSearching && (
            <SubModelTree parentRef={key} expanded={false} object3D={model!} componentRef={componentRef!} selectable />
          )}
        </EnhancedTree>
      )}
    </EnhancedTreeItem>
  );
};

SceneHierarchyTreeItem.displayName = 'SceneNodeTreeItem';

export default SceneHierarchyTreeItem;
