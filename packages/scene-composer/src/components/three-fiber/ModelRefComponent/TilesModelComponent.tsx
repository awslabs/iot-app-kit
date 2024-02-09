import React from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Object3D } from 'three';

import { MAX_CLICK_DISTANCE } from '../../../common/constants';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../store';
import { acceleratedRaycasting, getComponentGroupName } from '../../../utils/objectThreeUtils';
import {
  findComponentByType,
  createNodeWithPositionAndNormal,
  findNearestViableParentAncestorNodeRef,
} from '../../../utils/nodeUtils';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { KnownComponentType } from '../../../interfaces';
import { getIntersectionTransform } from '../../../utils/raycastUtils';

import { useTiles } from './TilesLoader';

interface TilesModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
}

export const TilesModelComponent: React.FC<TilesModelProps> = ({ node, component }: TilesModelProps) => {
  const sceneComposerId = useSceneComposerId();
  useLifecycleLogging('TilesModelComponent');
  const { getSceneNodeByRef } = useStore(sceneComposerId)((state) => state);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);
  const { isEditing, addingWidget, setAddingWidget, cursorLookAt } = useEditorState(sceneComposerId);

  // TODO: tilesRenderer holds "group" and it'll load tiles and B3DM/I3DM files dynanimcally, so we don't need
  //       to clone the model like what we did in GLTFModelComponent. However, if we found this assumption is
  //       wrong in the future, let's optimize from here.
  const tilesRenderer = useTiles(component.uri, uriModifier);

  // Enable optimized raycasting
  tilesRenderer.onLoadModel = (scene: Object3D) => {
    scene.traverse((obj: Object3D) => {
      acceleratedRaycasting(obj);
    });
  };

  useFrame(() => {
    tilesRenderer.update();
  });

  const handleAddWidget = (e: ThreeEvent<MouseEvent>) => {
    if (addingWidget) {
      const hierarchicalParent = findNearestViableParentAncestorNodeRef(e.eventObject);
      const hierarchicalParentNode = getSceneNodeByRef(hierarchicalParent?.userData.nodeRef);
      let physicalParent = hierarchicalParent;
      if (findComponentByType(hierarchicalParentNode, KnownComponentType.SubModelRef)) {
        while (physicalParent) {
          if (physicalParent.userData.componentTypes?.includes(KnownComponentType.ModelRef)) break;
          physicalParent = physicalParent.parent as THREE.Object3D<Event>;
        }
      }
      const { position } = getIntersectionTransform(e.intersections[0]);
      const newWidgetNode = createNodeWithPositionAndNormal(
        addingWidget,
        position,
        cursorLookAt,
        physicalParent,
        hierarchicalParent?.userData.nodeRef,
      );

      setAddingWidget(undefined);
      appendSceneNode(newWidgetNode);
      e.stopPropagation();
    }
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta <= MAX_CLICK_DISTANCE && isEditing() && addingWidget) {
      handleAddWidget(e);
    }
  };

  return (
    <group name={getComponentGroupName(node.ref, 'TILES_MODEL')} dispose={null}>
      <primitive object={tilesRenderer.group} onClick={onClick} />
    </group>
  );
};
