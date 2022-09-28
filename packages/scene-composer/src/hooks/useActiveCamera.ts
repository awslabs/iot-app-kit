import { useCallback } from 'react';
import * as THREE from 'three';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { useEditorState } from '../store';
import { CameraControlMode, CameraSettings } from '../interfaces';
import { DEFAULT_CAMERA_OPTIONS, DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET } from '../common/constants';
import { Transform } from '../models/SceneModels';

const useActiveCamera = () => {
  const sceneComposerId = useSceneComposerId();
  const {
    activeCameraSettings,
    setActiveCameraSettings,
    setCameraTarget,
    isViewing,
    mainCameraObject,
    activeCameraName,
    setActiveCameraName,
  } = useEditorState(sceneComposerId);

  const defaultCameraSettings: CameraSettings = {
    cameraType: 'Perspective',
    fov: DEFAULT_CAMERA_OPTIONS.fov,
    far: DEFAULT_CAMERA_OPTIONS.far,
    near: DEFAULT_CAMERA_OPTIONS.near,
    zoom: 1,
    transform: {
      position: DEFAULT_CAMERA_POSITION,
    },
  };

  const calculateTargetOrGetDefault = (transform: Transform) => {
    if (transform.rotation) {
      const obj3D = new THREE.Object3D();
      obj3D.position.set(...transform.position);
      obj3D.rotation.set(...transform.rotation);
      obj3D.updateMatrix();
      obj3D.updateMatrixWorld(true);

      // Place an object to look at in front of the parent and get it's world position
      const targetObj3D = new THREE.Object3D();
      obj3D.add(targetObj3D);
      targetObj3D.position.set(0, 0, -10);
      targetObj3D.updateMatrix();
      targetObj3D.updateMatrixWorld(true);
      const target = targetObj3D.getWorldPosition(new THREE.Vector3());
      return target.toArray();
    }

    return DEFAULT_CAMERA_TARGET;
  };

  const setActiveCamera = useCallback(
    (cameraSettings?: CameraSettings, mode: CameraControlMode = 'transition', forceSetTarget = false) => {
      const settings = cameraSettings ?? defaultCameraSettings;
      setActiveCameraSettings(settings);

      const cameraTarget = {
        position: settings.transform.position,
        target: calculateTargetOrGetDefault(settings.transform),
      };

      if (forceSetTarget || isViewing()) {
        setCameraTarget(cameraTarget, mode);
      }
    },
    [setActiveCameraSettings, setCameraTarget],
  );

  return {
    activeCameraSettings,
    setActiveCameraSettings: setActiveCamera,
    mainCameraObject,
    activeCameraName,
    setActiveCameraName,
  };
};

export default useActiveCamera;
