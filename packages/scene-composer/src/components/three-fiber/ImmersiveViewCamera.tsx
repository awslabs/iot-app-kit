import * as THREE from 'three';
import React, { Fragment, useContext, useEffect, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Camera } from '@react-three/fiber';

import useLogger from '../../logger/react-logger/hooks/useLogger';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { IViewpointComponentInternal, useEditorState, useStore } from '../../store';
import { KnownComponentType } from '../../interfaces';
import { findComponentByType } from '../../utils/nodeUtils';
import { TripodControlsImpl } from '../../three/TripodControlsImpl';
import { Layers } from '../../common/constants';

import { TripodControls } from './controls';

type CameraControlImpl = TripodControlsImpl;

const DEFAULT_CAMERA_CONTROLS_OPTIONS: Pick<CameraControlImpl, 'dampingFactor'> = {
  dampingFactor: 0.2,
};

export const ImmersiveViewCamera = React.forwardRef<Camera>((_, forwardedRef) => {
  const log = useLogger('ImmersiveViewCamera');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const { cameraControlsType, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const selectedViewpointNode = useStore(sceneComposerId)((state) =>
    state.getSceneNodeByRef(state.selectedViewpointNodeRef),
  );
  const selectedSceneNode = useStore(sceneComposerId)((state) => state.getSceneNodeByRef(state.selectedSceneNodeRef));

  const makeDefault = cameraControlsType === 'immersive';
  const cameraControlsImplRef = useRef<TripodControlsImpl>(null);

  const cameraRef = useRef<Camera>();

  useEffect(() => {
    log?.verbose('Setting the Immersive Camera');

    let position = [0, 1.5, 0];
    const component = findComponentByType(selectedViewpointNode, KnownComponentType.Viewpoint);
    if (component) {
      const viewpointComponent = component as IViewpointComponentInternal;
      position = viewpointComponent.cameraPosition;
    }

    const viewpointObject = getObject3DBySceneNodeRef(selectedViewpointNode?.ref);
    const cameraPosition = new THREE.Vector3(position[0], position[1], position[2]);
    let parent: THREE.Object3D | null = viewpointObject?.parent || null;
    while (parent) {
      cameraPosition.add(parent.position);
      parent = parent.parent;
    }

    if (cameraControlsImplRef.current) {
      cameraControlsImplRef.current.object.position.copy(cameraPosition);
      if (selectedSceneNode) {
        cameraControlsImplRef.current.object.lookAt(
          new THREE.Vector3(
            selectedSceneNode.transform.position[0],
            selectedSceneNode.transform.position[1],
            selectedSceneNode.transform.position[2],
          ),
        );
      }
    }
  }, [selectedViewpointNode, selectedSceneNode]);

  useEffect(() => {
    cameraRef.current?.layers.enable(Layers.RenderOnly);
  }, [cameraRef.current]);

  // TODO: Might need fly controls to maintain rotation.

  // TODO: We should split the camera and controls into different components
  return (
    <Fragment>
      <PerspectiveCamera
        name={'ImmersiveCamera'}
        makeDefault={makeDefault}
        ref={mergeRefs([forwardedRef, cameraRef])}
      />
      <TripodControls
        camera={cameraRef.current}
        {...DEFAULT_CAMERA_CONTROLS_OPTIONS}
        makeDefault={makeDefault}
        ref={cameraControlsImplRef}
      />
    </Fragment>
  );
});
