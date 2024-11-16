import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { type Camera, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { useEditorHelper } from '../../../hooks';
import useActiveCamera from '../../../hooks/useActiveCamera';
import useSelectedNode from '../../../hooks/useSelectedNode';
import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { CameraType } from '../../../models/SceneModels';
import { type ICameraComponentInternal, type ISceneNodeInternal, useEditorState } from '../../../store';
import { getCameraSettings } from '../../../utils/cameraUtils';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';

interface ICameraComponentProps {
  node: ISceneNodeInternal;
  component: ICameraComponentInternal;
}

const CameraComponent: React.FC<ICameraComponentProps> = ({ node, component }: ICameraComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  useLifecycleLogging('CameraComponent');
  const camera = useRef<Camera>();

  const size = useThree((state) => state.size);
  const { fov, far, near, zoom } = component;

  const { isEditing, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);

  const { selectedSceneNodeRef } = useSelectedNode();
  const { activeCameraName, setActiveCameraSettings } = useActiveCamera();

  useEditorHelper(isEditing() && selectedSceneNodeRef === node.ref, sceneComposerId, camera, THREE.CameraHelper);

  useEffect(() => {
    if (activeCameraName === node.name) {
      const object3D = getObject3DBySceneNodeRef(node.ref);

      setActiveCameraSettings(
        getCameraSettings(object3D, {
          cameraType: CameraType.Perspective,
          fov,
          near,
          far,
          zoom,
        }),
      );
    }
  }, [activeCameraName]);

  let cameraNode: JSX.Element;
  if (component.cameraType === CameraType.Orthographic) {
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
