import { Euler, Quaternion, Vector3 } from 'three';

import { type ICameraComponentInternal } from '../store';
import { type CameraSettings, type ICameraBasics } from '../interfaces';
import { DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_SETTINGS } from '../common/constants';
import { CameraType } from '../models/SceneModels';

export const getCameraSettings = (
  object3D: THREE.Object3D | undefined,
  cameraDetails: ICameraBasics | ICameraComponentInternal,
): CameraSettings => {
  const transform = object3D
    ? {
        position: object3D.getWorldPosition(new Vector3()).toArray(),
        rotation: new Vector3()
          .setFromEuler(new Euler().setFromQuaternion(object3D.getWorldQuaternion(new Quaternion())))
          .toArray(),
        scale: object3D.getWorldScale(new Vector3()).toArray(),
      }
    : {
        position: DEFAULT_CAMERA_POSITION,
      };

  if (cameraDetails) {
    return {
      cameraType: cameraDetails.cameraType,
      fov: cameraDetails.fov,
      far: cameraDetails.far,
      near: cameraDetails.near,
      zoom: cameraDetails.zoom,
      transform,
    };
  }

  return {
    ...DEFAULT_CAMERA_SETTINGS,
    cameraType: CameraType.Perspective,
    transform,
  };
};
