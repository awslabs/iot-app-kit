import * as THREE from 'three';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { invalidate, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { Vector3 } from '../../interfaces';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../store';
import { appendFunction } from '../../utils/objectUtils';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { acceleratedRaycasting, deepClone, enableShadow, getComponentGroupName } from '../../utils/objectThreeUtils';
import { getScaleFactor } from '../../utils/mathUtils';
import { getIntersectionTransform } from '../../utils/raycastUtils';
import { createNodeWithTransform } from '../../utils/nodeUtils';

import { useGLTF } from './GLTFLoader';

function processObject(component: IModelRefComponentInternal, obj: THREE.Object3D, options: { maxAnisotropy: number }) {
  deepClone(obj);
  acceleratedRaycasting(obj);
  enableShadow(component, obj, options.maxAnisotropy);
}

interface ClosestViewpoint {
  viewpoint: THREE.Object3D | null;
  distance: number;
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
  const { gl, scene, camera } = useThree();
  const maxAnisotropy = useMemo(() => gl.capabilities.getMaxAnisotropy(), []);
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const {
    selectedViewpointNodeRef,
    setSelectedViewpointNodeRef,
    isEditing,
    addingWidget,
    setAddingWidget,
    cursorPosition,
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
    result.userData = { nodeRef: node.ref };

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

    if (Date.now() - lastPointerMove >= CURSOR_VISIBILITY_TIMEOUT && !addingWidget) {
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

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    // Show only while hidden or adding widget
    if (hiddenWhileImmersive || addingWidget) {
      setLastPointerMove(Date.now());

      if (!cursorVisible) setCursorVisible(true);

      if (e.intersections.length > 0) {
        const { position, normal } = getIntersectionTransform(e.intersections[0]);
        setCursorPosition(position);
        setCursorLookAt(normal || new THREE.Vector3(0, 0, 0));
      }
      e.stopPropagation();
    }
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartingPointerPosition(new THREE.Vector2(e.screenX, e.screenY));
  };

  const handleViewpointNavigation = (e: ThreeEvent<MouseEvent>) => {
    const isInViewFrustum = (object: THREE.Object3D) => {
      camera.updateMatrix();
      camera.updateMatrixWorld();

      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
      );
      return frustum.containsPoint(object.getWorldPosition(new THREE.Vector3()));
    };

    // Get the nearest viewpoint from scene
    const viewpoints: THREE.Object3D[] = [];
    scene.traverse((object3D) => {
      if (object3D.type === 'Viewpoint') {
        viewpoints.push(object3D);
      }
    });

    const closest: ClosestViewpoint = {
      viewpoint: null,
      distance: Number.MAX_VALUE,
    };
    viewpoints.forEach((viewpoint) => {
      const distance = cursorPosition.distanceTo(viewpoint.getWorldPosition(new THREE.Vector3()));

      if (isInViewFrustum(viewpoint)) {
        if (!closest.viewpoint || closest.distance > distance) {
          closest.viewpoint = viewpoint;
          closest.distance = distance;
        }
      }
    });

    if (closest.viewpoint) {
      const newRef = closest.viewpoint.userData.nodeRef;
      if (newRef && newRef !== selectedViewpointNodeRef) {
        setSelectedViewpointNodeRef(closest.viewpoint.userData.nodeRef);
      }
    }

    e.stopPropagation();
  };

  const handleAddWidget = (e: ThreeEvent<MouseEvent>) => {
    if (addingWidget) {
      const parent = clonedModelScene;
      const { position } = getIntersectionTransform(e.intersections[0]);
      const newWidgetNode = createNodeWithTransform(addingWidget, position, cursorLookAt, parent);

      appendSceneNode(newWidgetNode);
      setAddingWidget(undefined);

      e.stopPropagation();
    }
  };

  const onPointerUp = (e: ThreeEvent<MouseEvent>) => {
    const currentPosition = new THREE.Vector2(e.screenX, e.screenY);

    // Check if we treat it as a click
    if (startingPointerPosition.distanceTo(currentPosition) <= MAX_CLICK_DISTANCE) {
      if (isEditing() && addingWidget) {
        handleAddWidget(e);
      } else if (hiddenWhileImmersive) {
        handleViewpointNavigation(e);
      }
    }
  };

  return (
    <group name={getComponentGroupName(node.ref, 'GLTF_MODEL')} scale={scale} dispose={null}>
      <primitive
        object={clonedModelScene}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
    </group>
  );
};
