import * as THREE from 'three';

import { ICameraComponentInternal } from '../store';
import { CameraSettings, ICameraBasics } from '../interfaces';
import { DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_SETTINGS } from '../common/constants';

export const getCameraSettings = (
  object3D: THREE.Object3D | undefined,
  cameraDetails: ICameraBasics | ICameraComponentInternal,
): CameraSettings => {
  const transform = object3D
    ? {
        position: object3D.getWorldPosition(new THREE.Vector3()).toArray(),
        rotation: new THREE.Euler()
          .setFromQuaternion(object3D.getWorldQuaternion(new THREE.Quaternion()))
          .toVector3()
          .toArray(),
        scale: object3D.getWorldScale(new THREE.Vector3()).toArray(),
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
    cameraType: 'Perspective',
    transform,
  };
};
