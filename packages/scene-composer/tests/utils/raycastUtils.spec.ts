import * as THREE from 'three';

import { getIntersectionTransform } from '../../src/utils/raycastUtils';

describe('raycastUtils', () => {
  describe('getIntersectionTransform', () => {
    it('should return just position if normal is unavailable', () => {
      const intersection = {
        point: new THREE.Vector3(1, 2, 3),
      } as THREE.Intersection;

      const transform = getIntersectionTransform(intersection);

      expect(transform.position).toEqual(new THREE.Vector3(1, 2, 3));
      expect(transform.normal).toBeUndefined();
    });

    it('should return position and normal', () => {
      const object = new THREE.Object3D();
      const intersection = {
        object,
        point: new THREE.Vector3(1, 2, 3),
        face: {
          normal: new THREE.Vector3(0, 1, 0),
        },
      } as THREE.Intersection;

      const transform = getIntersectionTransform(intersection);

      expect(transform.position).toEqual(new THREE.Vector3(1, 2, 3));
      expect(transform.normal).toEqual(new THREE.Vector3(1, 3, 3));
    });
  });
});
