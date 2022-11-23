import React, { FC, useCallback, useContext, useState } from 'react';
import { Object3D } from 'three';

import ISceneHierarchyNode from '../../model/ISceneHierarchyNode';
import { useChildNodes, useSceneHierarchyData } from '../../SceneHierarchyDataProvider';
import { DropHandler } from '../../../../../hooks/useDropMonitor';
import SubModelTree from '../SubModelTree';
import { COMPOSER_FEATURES, KnownComponentType } from '../../../../../interfaces';
import { IModelRefComponentInternal, useSceneDocument } from '../../../../../store';
import { ModelType } from '../../../../../models/SceneModels';
import useFeature from '../../../../../hooks/useFeature';
import { findComponentByType } from '../../../../../utils/nodeUtils';
import { sceneComposerIdContext } from '../../../../../common/sceneComposerIdContext';

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
  expanded: defaultExpanded = false,
}: SceneHierarchyTreeItemProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const { selected, select, unselect, activate, move, selectionMode, getObject3DBySceneNodeRef, isViewing } =
    useSceneHierarchyData();

  const model = getObject3DBySceneNodeRef(key) as Object3D | undefined;
  const [childNodes] = useChildNodes(key);
  const isValidModelRef = componentTypes?.find(
    (type) =>
      type === KnownComponentType.ModelRef &&
      (type as unknown as IModelRefComponentInternal)?.modelType !== ModelType.Environment,
  );

  const [{ variation: subModelSelectionEnabled }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.SubModelSelection]);
  const showSubModel = subModelSelectionEnabled === 'T1' && isValidModelRef && !!model && !isViewing();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { getSceneNodeByRef } = useSceneDocument(sceneComposerId);
  const node = getSceneNodeByRef(key);
  const isSubModel = !!findComponentByType(node, KnownComponentType.SubModelRef);
  const componentRef = findComponentByType(node, KnownComponentType.ModelRef)?.ref;
  const { searchTerms } = useSceneHierarchyData();
  const isSearching = searchTerms !== '';

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
      expandable={node && node.childRefs.length > 0 && !isSearching}
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
