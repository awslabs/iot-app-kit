import * as THREE from 'three';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';

import useLogger from '../../logger/react-logger/hooks/useLogger';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useStore } from '../../store';
import { TransformControls as TransformControlsImpl } from '../../three/TransformControls';
import { snapObjectToFloor } from '../../three/transformUtils';
import { isLinearPlaneMotionIndicator } from '../../utils/sceneComponentUtils';
import { findComponentByType, isEnvironmentNode } from '../../utils/nodeUtils';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';

export function EditorTransformControls() {
  const { domElement } = useThree(({ gl }) => gl);
  const log = useLogger('EditorTransformControls');
  const camera = useThree(({ camera }) => camera);
  const sceneComposerId = useContext(sceneComposerIdContext);
  const transformControlMode = useStore(sceneComposerId)((state) => state.transformControlMode);
  const setTransformControlsMode = useStore(sceneComposerId)((state) => state.setTransformControlMode);
  const setTransformControls = useStore(sceneComposerId)((state) => state.setTransformControls);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const selectedSceneNode = useStore(sceneComposerId)((state) => state.getSceneNodeByRef(selectedSceneNodeRef));
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const addingWidget = useStore(sceneComposerId)((state) => state.addingWidget);

  const [transformControls] = useState(() => new TransformControlsImpl(camera, domElement));
  const tagResizeEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagResize];

  const isTagComponent = useMemo(
    () => !!findComponentByType(selectedSceneNode, KnownComponentType.Tag),
    [selectedSceneNode],
  );

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
      if (isTagComponent && !tagResizeEnabled && transformControlMode === 'scale') {
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
    }
  }, [selectedSceneNode, transformControlMode]);

  // Update transform controls' attached object
  useEffect(() => {
    if (selectedSceneNodeRef && !isEnvironmentNode(selectedSceneNode)) {
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
      const rootState = useStore(sceneComposerId).getState();
      const selectedSceneNodeRef = rootState.selectedSceneNodeRef;
      const sceneNode = rootState.getSceneNodeByRef(selectedSceneNodeRef);

      if (sceneNode) {
        let position = [controlledObject.position.x, controlledObject.position.y, controlledObject.position.z];

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
