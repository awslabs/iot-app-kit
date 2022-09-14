import * as THREE from 'three';
import React, { useEffect } from 'react';
import { useHelper } from '@react-three/drei/core/useHelper';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Camera, useThree } from '@react-three/fiber';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { ISceneNodeInternal, useEditorState, ICameraComponentInternal } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import useSelectedNode from '../../../hooks/useSelectedNode';
import useActiveCamera from '../../../hooks/useActiveCamera';
import { getCameraSettings } from '../../../utils/cameraUtils';

interface ICameraComponentProps {
  node: ISceneNodeInternal;
  component: ICameraComponentInternal;
}

const CameraComponent: React.FC<ICameraComponentProps> = ({ node, component }: ICameraComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  useLifecycleLogging('CameraComponent');
  const camera = React.useRef<Camera>();

  const cameraHelperRef = useHelper(camera, THREE.CameraHelper);
  const size = useThree((state) => state.size);
  const { fov, far, near, zoom } = component;

  const { isEditing, isLoadingModel, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);

  const { selectedSceneNodeRef } = useSelectedNode();
  const { activeCameraName, setActiveCameraSettings } = useActiveCamera();

  useEffect(() => {
    if (activeCameraName === node.name) {
      const object3D = getObject3DBySceneNodeRef(node.ref);

      setActiveCameraSettings(
        getCameraSettings(object3D, {
          cameraType: 'Perspective',
          fov,
          near,
          far,
          zoom,
        }),
      );
    }
  }, [activeCameraName]);

  useEffect(() => {
    if (cameraHelperRef.current) {
      cameraHelperRef.current.visible = isEditing() && !isLoadingModel;
    }
  }, [isEditing, isLoadingModel, cameraHelperRef]);

  let cameraNode: JSX.Element;
  if (component.cameraType === 'Orthographic') {
    cameraNode = (
      <OrthographicCamera
        // TODO: Make Editable once we expose this camera type
        top={3}
        bottom={-3}
        left={-3}
        right={3}
        far={far}
        zoom={1}
        near={near}
        ref={camera}
      >
        <meshBasicMaterial attach='material' />
      </OrthographicCamera>
    );
  } else {
    cameraNode = (
      <PerspectiveCamera fov={fov} far={far} near={near} aspect={size.width / size.height} ref={camera}>
        <meshBasicMaterial attach='material' />
      </PerspectiveCamera>
    );
  }

  return (
    <group name={getComponentGroupName(node.ref, 'CAMERA')}>
      {isEditing() && selectedSceneNodeRef === node.ref && cameraNode}
    </group>
  );
};

export default CameraComponent;
