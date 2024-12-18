import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { type Object3D } from 'three';

import { MAX_CLICK_DISTANCE } from '../../../common/constants';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { KnownComponentType } from '../../../interfaces';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { accessStore, type IModelRefComponentInternal, type ISceneNodeInternal, useEditorState } from '../../../store';
import {
  createNodeWithPositionAndNormal,
  findComponentByType,
  findNearestViableParentAncestorNodeRef,
} from '../../../utils/nodeUtils';
import { acceleratedRaycasting, getComponentGroupName } from '../../../utils/objectThreeUtils';
import { getIntersectionTransform } from '../../../utils/raycastUtils';

import { useTiles } from './TilesLoader';

interface TilesModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
}

export const TilesModelComponent: React.FC<TilesModelProps> = ({ node, component }: TilesModelProps) => {
  const sceneComposerId = useSceneComposerId();
  useLifecycleLogging('TilesModelComponent');
  const { getSceneNodeByRef } = accessStore(sceneComposerId)((state) => state);
  const appendSceneNode = accessStore(sceneComposerId)((state) => state.appendSceneNode);
  const uriModifier = accessStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);
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
          // @ts-expect-error type mismatch after update
          physicalParent = physicalParent.parent as THREE.Object3D<Event>;
        }
      }
      const { position } = getIntersectionTransform(e.intersections[0]);
      const newWidgetNode = createNodeWithPositionAndNormal(
        addingWidget,
        // @ts-expect-error type mismatch after update
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
