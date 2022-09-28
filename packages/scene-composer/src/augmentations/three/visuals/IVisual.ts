import * as THREE from 'three';

export interface IVisual extends THREE.Object3D {
  name: string;
  visual: THREE.Object3D | undefined;
  setVisible: (value: boolean) => void;
}
