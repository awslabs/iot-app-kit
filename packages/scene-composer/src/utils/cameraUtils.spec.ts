import * as THREE from 'three';

import { ICameraBasics, KnownComponentType } from '../interfaces';
import { ICameraComponentInternal } from '../store';

import { getCameraSettings } from './cameraUtils';

describe('cameraUtils', () => {
  describe('getCameraSettings', () => {
    const object3D = new THREE.Object3D();
    object3D.position.set(5, 5, 5);
    object3D.rotation.set(0, 0, 0);
    object3D.scale.set(1, 1, 1);

    const cameraBasics: ICameraBasics = {
      cameraType: 'Perspective',
      fov: 45,
      near: 0.2,
      far: 500,
      zoom: 1,
    };

    const cameraComponent: ICameraComponentInternal = {
      ...cameraBasics,
      ref: 'test-ref',
      type: KnownComponentType.Camera,
    };

    it('should return object3D world coordinates and camera basics if provided', () => {
      const cameraSettings = getCameraSettings(object3D, cameraBasics);
      expect(cameraSettings).toMatchSnapshot();
    });

    it('should return object3D world coordinates and camera component if provided', () => {
      const cameraSettings = getCameraSettings(object3D, cameraComponent);
      expect(cameraSettings).toMatchSnapshot();
    });

    it('should return object3D world coordinates and default camera settings', () => {
      const cameraSettings = getCameraSettings(object3D, undefined);
      expect(cameraSettings).toMatchSnapshot();
    });

    it('should return default position and camera basics', () => {
      const cameraSettings = getCameraSettings(undefined, cameraBasics);
      expect(cameraSettings).toMatchSnapshot();
    });

    it('should return defaults', () => {
      const cameraSettings = getCameraSettings(undefined, undefined);
      expect(cameraSettings).toMatchSnapshot();
    });
  });
});
