import * as THREE from 'three';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { invalidate, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { Vector3, KnownComponentType } from '../../../interfaces';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../store';
import { appendFunction } from '../../../utils/objectUtils';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  acceleratedRaycasting,
  cloneMaterials,
  enableShadow,
  getComponentGroupName,
} from '../../../utils/objectThreeUtils';
import { getScaleFactor } from '../../../utils/mathUtils';
import { getIntersectionTransform } from '../../../utils/raycastUtils';
import {
  createNodeWithPositionAndNormal,
  findComponentByType,
  findNearestViableParentAncestorNodeRef,
} from '../../../utils/nodeUtils';

import { useGLTF } from './GLTFLoader';

function processObject(component: IModelRefComponentInternal, obj: THREE.Object3D, options: { maxAnisotropy: number }) {
  cloneMaterials(obj);
  acceleratedRaycasting(obj);
  enableShadow(component, obj, options.maxAnisotropy);
  obj.userData.isOriginal = true; // This is important to the SubModelSelection tool, it's used to filter out geomtry we've added with our
  obj.userData.componentRef = component.ref;
}

interface GLTFModelProps {
  node: ISceneNodeInternal;
  component: IModelRefComponentInternal;
  hiddenWhileImmersive: boolean;
}

export const GLTFModelComponent: React.FC<GLTFModelProps> = ({
  node,
  component,
  hiddenWhileImmersive,
}: GLTFModelProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const log = useLifecycleLogging('GLTFModelComponent');
  const { gl } = useThree();
  const maxAnisotropy = useMemo(() => gl.capabilities.getMaxAnisotropy(), []);
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const { getSceneNodeByRef } = useStore(sceneComposerId)((state) => state);
  const {
    isEditing,
    addingWidget,
    setAddingWidget,
    cursorLookAt,
    cursorVisible,
    setCursorPosition,
    setCursorLookAt,
    setCursorVisible,
  } = useEditorState(sceneComposerId);

  const [startingPointerPosition, setStartingPointerPosition] = useState<THREE.Vector2>(new THREE.Vector2());

  const [lastPointerMove, setLastPointerMove] = useState<number>(Date.now());

  const CURSOR_VISIBILITY_TIMEOUT = 1000; // 1 second
  const MAX_CLICK_DISTANCE = 2;

  useEffect(() => {
    setCursorVisible(hiddenWhileImmersive || !!addingWidget);
  }, [hiddenWhileImmersive, addingWidget]);

  const gltf = useGLTF(
    component.uri,
    uriModifier,
    (loader) => {
      loader.manager.onStart = appendFunction(loader.manager.onStart, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(true);
        }, 0);
      });
      loader.manager.onLoad = appendFunction(loader.manager.onLoad, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(false);
        }, 0);
      });
      loader.manager.onError = appendFunction(loader.manager.onError, () => {
        // Use setTimeout to avoid mutating the state during rendering process
        setTimeout(() => {
          useStore(sceneComposerId).getState().setLoadingModelState(false);
        }, 0);
      });
    },
    (progressEvent) => {
      let contentLength = NaN;
      if (progressEvent.lengthComputable) {
        contentLength = progressEvent.total;
      }
      // @ts-ignore - __onDownloadProgress is injected in the LoadingProgress component
      const onDownloadingProgress = THREE.DefaultLoadingManager.__onDownloadProgress;

      if (onDownloadingProgress) {
        const target = progressEvent.target as XMLHttpRequest;
        // target should never be falsy
        if (target) {
          onDownloadingProgress(target.responseURL, progressEvent.loaded, contentLength);
        } else {
          log?.error('Unexpected error. target is not a valid XMLHttpRequest');
        }
      }
    },
  ) as GLTF;

  const clonedModelScene = useMemo(() => {
    const result = SkeletonUtils.clone(gltf.scene);
    result.traverse((obj) => processObject(component, obj, { maxAnisotropy }));

    invalidate();
    return result;
  }, [gltf, component]);

  useFrame(() => {
    // TODO: Optimize this loop. Currently, the shadow setting is not applied when only setting in the clonedModelScene
    // creation function. To work around the issue, we'll update the shadow setting for each render loop.
    clonedModelScene.traverse((obj) => {
      enableShadow(component, obj, maxAnisotropy);

      if ((obj as THREE.Mesh).material) {
        const mesh = obj as THREE.Mesh;

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            material.colorWrite = !hiddenWhileImmersive;
          });
        } else {
          (mesh.material as THREE.Material).colorWrite = !hiddenWhileImmersive;
        }
      }
    });

    if (Date.now() - lastPointerMove >= CURSOR_VISIBILITY_TIMEOUT && !addingWidget && cursorVisible) {
      setCursorVisible(false);
    }
  });

  let scale: Vector3 = [1, 1, 1];
  if (component.localScale) {
    scale = component.localScale;
  } else if (component.unitOfMeasure) {
    const factor = getScaleFactor(component.unitOfMeasure, 'meters');
    scale = [factor, factor, factor];
  }

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartingPointerPosition(new THREE.Vector2(e.screenX, e.screenY));
  };

  const handleAddWidget = (e: ThreeEvent<MouseEvent>) => {
    if (addingWidget) {
      const hierarchicalParent = findNearestViableParentAncestorNodeRef(e.object);
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

  const onPointerUp = (e: ThreeEvent<MouseEvent>) => {
    const currentPosition = new THREE.Vector2(e.screenX, e.screenY);
    if (startingPointerPosition.distanceTo(currentPosition) <= MAX_CLICK_DISTANCE) {
      if (isEditing() && addingWidget) {
        handleAddWidget(e);
      }
    }
  };

  return (
    <group name={getComponentGroupName(node.ref, 'GLTF_MODEL')} scale={scale} dispose={null}>
      <primitive object={clonedModelScene} onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
    </group>
  );
};

export const ErrorModelComponent: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  );
};
