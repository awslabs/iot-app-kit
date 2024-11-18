import type * as THREE from 'three';

import { type Vector3 } from '../../../interfaces';

export interface MotionIndicatorProps {
  speed: number;
  foregroundColor?: THREE.Color;
  backgroundColor?: THREE.Color;
  scale: Vector3;
}
