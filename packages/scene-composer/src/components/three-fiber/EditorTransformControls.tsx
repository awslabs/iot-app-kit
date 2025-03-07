import { useThree } from '@react-three/fiber';
import { useContext, useEffect, useState } from 'react';
import type * as THREE from 'three';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';
import useLogger from '../../logger/react-logger/hooks/useLogger';
import { accessStore } from '../../store';
import { TransformControls as TransformControlsImpl } from '../../three/TransformControls';
import { snapObjectToFloor } from '../../three/transformUtils';
import { findComponentByType } from '../../utils/nodeUtils';
import { isLinearPlaneMotionIndicator } from '../../utils/sceneComponentUtils';

export function EditorTransformControls() {
  const { domElement } = useThree(({ gl }) => gl);
  const log = useLogger('EditorTransformControls');
  const camera = useThree(({ camera }) => camera);
  const sceneComposerId = useContext(sceneComposerIdContext);
  const transformControlMode = accessStore(sceneComposerId)((state) => state.transformControlMode);
  const setTransformControlsMode = accessStore(sceneComposerId)((state) => state.setTransformControlMode);
  const setTransformControls = accessStore(sceneComposerId)((state) => state.setTransformControls);
  const selectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const selectedSceneNode = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef(selectedSceneNodeRef));
  const getObject3DBySceneNodeRef = accessStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const addingWidget = accessStore(sceneComposerId)((state) => state.addingWidget);

  const [transformControls] = useState(() => new TransformControlsImpl(camera, domElement));
  const subModelMovementEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SubModelMovement];

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isSubModelComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.SubModelRef);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);

  const transformVisible = !isSubModelComponent || subModelMovementEnabled;
  const shouldResetModeToTranslate =
    (isTagComponent || isOverlayComponent) && (transformControlMode === 'scale' || transformControlMode === 'rotate');

  // Set transform controls' camera
  useEffect(() => {
    setTransformControls(transformControls);
    if (camera) {
      // @ts-ignore: transformControls has a camera prop that TS does not know.
      transformControls.camera = camera;
    } else {
      log?.warn('no editor camera was found.');
    }
  }, [transformControls, camera, log]);

  // Update transform controls' mode
  useEffect(() => {
    transformControls.setMode(transformControlMode);
  }, [transformControlMode]);

  useEffect(() => {
    if (selectedSceneNode) {
      if (shouldResetModeToTranslate) {
        // Prevent the scale from being enabled
        setTransformControlsMode('translate');
      }
      // TODO: Fix TransformControls typings so we can remove @ts-ignore directive
      // TransformControls defines properties using Object.defineProperty but TypeScript cannot infer the types
      // https://github.com/microsoft/TypeScript/issues/28694
      // @ts-ignore
      transformControls.showY =
        (selectedSceneNode.transformConstraint.snapToFloor !== true ||
          (selectedSceneNode.transformConstraint.snapToFloor === true && transformControlMode !== 'translate')) &&
        !(isLinearPlaneMotionIndicator(selectedSceneNode) && transformControlMode === 'scale');
      // TODO: Fix TransformControls typings so we can remove @ts-ignore directive
      // TransformControls defines properties using Object.defineProperty but TypeScript cannot infer the types
      // https://github.com/microsoft/TypeScript/issues/28694
      // @ts-ignore
      transformControls.flipY = isOverlayComponent && transformControlMode === 'translate';
    }
  }, [selectedSceneNode, transformControlMode, shouldResetModeToTranslate, isOverlayComponent]);

  // Update transform controls' attached object
  useEffect(() => {
    if (selectedSceneNodeRef && transformVisible) {
      const object3d = getObject3DBySceneNodeRef(selectedSceneNodeRef);
      if (object3d) {
        log?.verbose('attach transform controls to', object3d);
        transformControls.attach(object3d);
      } else {
        log?.warn('Warn: unexpected selectedNode ' + selectedSceneNodeRef);
      }
    } else {
      transformControls.detach();
    }
    // TODO: the current effect depends on the whole document, it can be optimized to a local node

    if (addingWidget) {
      transformControls.detach();
    }
  }, [selectedSceneNodeRef, selectedSceneNode, document, log, addingWidget]);

  // Transform control callbacks
  useEffect(() => {
    function transformControlsEventCallback() {
      const controlledObject = (transformControls as any).object as THREE.Object3D;
      // getting the state from zustand store directly in ThreeJS callback for performance consideration
      const rootState = accessStore(sceneComposerId).getState();
      const selectedSceneNodeRef = rootState.selectedSceneNodeRef;
      const sceneNode = rootState.getSceneNodeByRef(selectedSceneNodeRef);

      if (sceneNode) {
        let position: [number, number, number] = [
          controlledObject.position.x,
          controlledObject.position.y,
          controlledObject.position.z,
        ];

        if (sceneNode.transformConstraint.snapToFloor) {
          const parentNode = rootState.getSceneNodeByRef(sceneNode.parentRef);
          const parentObject3D = parentNode ? getObject3DBySceneNodeRef(parentNode.ref) : undefined;
          position = snapObjectToFloor(controlledObject, parentObject3D);
        }

        rootState.updateSceneNodeInternal(sceneNode.ref, {
          transform: {
            position,
            rotation: [controlledObject.rotation.x, controlledObject.rotation.y, controlledObject.rotation.z],
            scale: [controlledObject.scale.x, controlledObject.scale.y, controlledObject.scale.z],
          },
        });
      }
    }

    transformControls.addEventListener('mouseUp', transformControlsEventCallback);

    return () => {
      transformControls.removeEventListener('mouseUp', transformControlsEventCallback);
    };
  }, []);

  return <primitive dispose={null} object={transformControls} />;
}
