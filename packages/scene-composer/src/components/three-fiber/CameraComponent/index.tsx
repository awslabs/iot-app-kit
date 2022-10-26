import * as THREE from 'three';
import React, { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';

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
  const { isEditing, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const size = useThree((state) => state.size);
  const { fov, far, near, zoom } = component;

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

  const cameraHelper = useMemo(() => {
    let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    if (component.cameraType === 'Orthographic') {
      camera = new THREE.OrthographicCamera(-3, 3, 3, -3, near, far);
      camera.zoom = zoom;
    } else {
      camera = new THREE.PerspectiveCamera(fov, size.width / size.height, near, far);
      camera.zoom = zoom;
    }
    return new THREE.CameraHelper(camera);
  }, [component.cameraType]);

  return (
    <group name={getComponentGroupName(node.ref, 'CAMERA')}>
      {isEditing() && selectedSceneNodeRef === node.ref && <primitive object={cameraHelper} />}
    </group>
  );
};

export default CameraComponent;
