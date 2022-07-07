import * as THREE from 'three';
import React, { useContext } from 'react';
import { useHelper } from '@react-three/drei/core/useHelper';
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Camera, useFrame, useThree } from '@react-three/fiber';

import useLifcycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal, useEditorState, ICameraComponentInternal, useSceneDocument, useStore } from '../../store';
import { sceneComposerIdContext } from '../../sceneComposerIdContext';
import { getComponentGroupName } from '../../utils/objectThreeUtils';

interface ICameraComponentProps {
  node: ISceneNodeInternal;
  component: ICameraComponentInternal;
}

export const CameraComponent: React.FC<ICameraComponentProps> = ({ node, component }: ICameraComponentProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  useLifcycleLogging('CameraComponent');
  const camera = React.useRef<Camera>();

  const cameraHelperRef = useHelper(camera, THREE.CameraHelper);
  const size = useThree((state) => state.size);
  const { fov, far, near } = component;
  const { document } = useSceneDocument(sceneComposerId);

  const { isEditing } = useEditorState(sceneComposerId);

  const isDefaultViewingCamera = document.defaultCameraRef?.ref === component.ref;

  // Show camera helper if in editing mode
  // TODO: it should be hidden when loading stuff
  useFrame(() => {
    if (cameraHelperRef.current) {
      cameraHelperRef.current.visible =
        useStore(sceneComposerId).getState().isEditing() && !useStore(sceneComposerId).getState().isLoadingModel;
    }
  });

  // TODO: The camera component needs to be re-designed once we add the support for viewing camera management.

  let cameraNode: JSX.Element;
  if (component.cameraType === 'Orthographic') {
    cameraNode = (
      <OrthographicCamera
        makeDefault={!isEditing() && isDefaultViewingCamera}
        // TODO: Update view frustum params
        position={new THREE.Vector3(0, 0, 0)}
        top={3}
        bottom={-3}
        left={-3}
        right={3}
        far={1000}
        zoom={1}
        near={0}
        ref={camera}
      >
        <meshBasicMaterial attach='material' />
      </OrthographicCamera>
    );
  } else {
    cameraNode = (
      <PerspectiveCamera
        makeDefault={!isEditing() && isDefaultViewingCamera}
        position={new THREE.Vector3(0, 0, 0)}
        fov={fov}
        far={far}
        near={near}
        aspect={size.width / size.height}
        ref={camera}
      >
        <meshBasicMaterial attach='material' />
      </PerspectiveCamera>
    );
  }

  return <group name={getComponentGroupName(node.ref, 'CAMERA')}>{cameraNode}</group>;
};
