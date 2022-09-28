import * as THREE from 'three';

import { TransformControls } from '../src/three/TransformControls';

export interface FakeSceneDetails {
  scene: THREE.Scene;
  cube: THREE.Mesh;
  transformControls: TransformControls;
}

export const fakeScene = (camera, domElement): FakeSceneDetails => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(1, 2, -1);
  const transformControls = new TransformControls(camera, domElement);
  transformControls.name = 'testTransformControls';
  transformControls.scale.set(2, 2, 2);

  scene.add(cube, transformControls);

  return { scene, cube, transformControls };
};
