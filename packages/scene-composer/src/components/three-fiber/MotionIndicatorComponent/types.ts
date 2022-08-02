import * as THREE from 'three';

import { Vector3 } from '../../../interfaces';

export interface MotionIndicatorProps {
  speed: number;
  foregroundColor?: THREE.Color;
  backgroundColor?: THREE.Color;
  scale: Vector3;
}
