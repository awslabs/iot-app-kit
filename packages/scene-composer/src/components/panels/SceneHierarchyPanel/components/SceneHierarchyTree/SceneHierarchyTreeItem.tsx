import { Fragment, type FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { type Object3D } from 'three';

import type ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useChildNodes, useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { type DropHandler } from '../../../../../hooks/useDropMonitor';
import SubModelTree from '../SubModelTree';
import { KnownComponentType } from '../../../../../interfaces';
import { type IModelRefComponentInternal, useSceneDocument } from '../../../../../store';
import { findComponentByType } from '../../../../../utils/nodeUtils';
import { sceneComposerIdContext } from '../../../../../common/sceneComposerIdContext';
import { ModelType } from '../../../../../models/SceneModels';

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
  // Show sub models for non Tiles3D models in edit mode
  const showSubModel = useMemo(() => {
    return component && component.modelType !== ModelType.Tiles3D && !!model && !isViewing();
  }, [component, model]);
  const isSubModel = !!findComponentByType(node, KnownComponentType.SubModelRef);

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
      labelNode={
        <SceneNodeLabel
          dataTestid={node?.components && node.components.length > 0 ? node?.components[0].ref : undefined}
          objectRef={key}
          labelText={labelText}
          componentTypes={componentTypes}
        />
      }
      labelText={labelText}
      onExpand={onExpandNode}
      expanded={expanded}
      expandable={((node && node.childRefs.length > 0) || showSubModel) && !isSearching}
      selected={selected === key}
      selectionMode={selectionMode}
      onSelected={isViewing() ? onActivated : onToggle}
      onActivated={onActivated}
      acceptDrop={AcceptableDropTypes}
      onDropped={dropHandler}
      draggable={enableDragAndDrop && !isViewing() && !isSubModel}
      dataType={componentTypes && componentTypes.length > 0 ? componentTypes[0] : /* istanbul ignore next */ 'default'} // TODO: This is somewhat based on the current assumption that items will currently only really have one componentType
      data={{ ref: key }}
    >
      {expanded && (
        <EnhancedTree droppable={enableDragAndDrop} acceptDrop={AcceptableDropTypes} onDropped={dropHandler}>
          {childNodes.map((node, index) => (
            <Fragment key={index}>
              {!isSearching && (
                <SceneHierarchyTreeItem key={node.objectRef} enableDragAndDrop={enableDragAndDrop} {...node} />
              )}
            </Fragment>
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
