import { MathUtils } from 'three';

import { TransformControlMode } from '../interfaces';

export const getPropertyForKeyEvent = (mode: TransformControlMode) => {
  const propertyMap = {
    translate: { property: 'position', amount: 1 },
    rotate: { property: 'rotation', amount: MathUtils.degToRad(5) },
    scale: { property: 'scale', amount: 1 },
  };
  return propertyMap[mode];
};

export const handleKeyEventTransform = (
  controlledObject: THREE.Object3D,
  keyPressEvent: KeyboardEvent,
  property: string,
  amount: number,
) => {
  switch (keyPressEvent.key) {
    case 'ArrowRight':
      controlledObject[property].x += amount;
      break;
    case 'ArrowLeft':
      controlledObject[property].x -= amount;
      break;
    case 'ArrowUp':
      // hold shift to control z axis
      if (keyPressEvent.shiftKey) {
        controlledObject[property].z += amount;
      } else {
        controlledObject[property].y += amount;
      }
      break;
    case 'ArrowDown':
      if (keyPressEvent.shiftKey) {
        controlledObject[property].z -= amount;
      } else {
        controlledObject[property].y -= amount;
      }
      break;
  }
};
