import { type ThreeEvent } from '@react-three/fiber';
import { useCallback } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { KnownComponentType } from '../interfaces';
import { accessStore, useEditorState } from '../store';
import {
  createNodeWithPositionAndNormal,
  findComponentByType,
  findNearestViableParentAncestorNodeRef,
} from '../utils/nodeUtils';
import { getIntersectionTransform } from '../utils/raycastUtils';

const useAddWidget: () => {
  handleAddWidget: (e: ThreeEvent<MouseEvent>) => void;
} = () => {
  const sceneComposerId = useSceneComposerId();
  const { addingWidget, setAddingWidget, cursorLookAt } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef } = accessStore(sceneComposerId)((state) => state);
  const appendSceneNode = accessStore(sceneComposerId)((state) => state.appendSceneNode);

  const handleAddWidget = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (addingWidget) {
        const hierarchicalParent = findNearestViableParentAncestorNodeRef(e.eventObject);
        const hierarchicalParentNode = getSceneNodeByRef(hierarchicalParent?.userData.nodeRef);
        let physicalParent = hierarchicalParent;
        if (findComponentByType(hierarchicalParentNode, KnownComponentType.SubModelRef)) {
          while (physicalParent) {
            if (physicalParent.userData.componentTypes?.includes(KnownComponentType.ModelRef)) break;
            // @ts-expect-error type mistmatch after upgrade
            physicalParent = physicalParent.parent as THREE.Object3D<Event>;
          }
        }
        const { position } = getIntersectionTransform(e.intersections[0]);
        const newWidgetNode = createNodeWithPositionAndNormal(
          addingWidget,
          // @ts-expect-error type mistmatch after upgrade
          position,
          cursorLookAt,
          physicalParent,
          hierarchicalParent?.userData.nodeRef,
        );

        setAddingWidget(undefined);
        appendSceneNode(newWidgetNode);
        e.stopPropagation();
      }
    },
    [addingWidget, cursorLookAt, setAddingWidget, getSceneNodeByRef, appendSceneNode],
  );

  return { handleAddWidget };
};

export default useAddWidget;
