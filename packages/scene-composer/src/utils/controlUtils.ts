import { MapControls, OrbitControls } from '../three/OrbitControls';
import { PointerLockControls } from '../three/PointerLockControls';
import { CameraControlsType } from '../interfaces';
import { CameraControlImpl } from '../store/internalInterfaces';

export const isPointerLockControl = (controlType: CameraControlsType): boolean => {
  return controlType === 'pointerLock' ? true : false;
};

export const isOrbitControl = (controlType: CameraControlsType): boolean => {
  return controlType === 'orbit' ? true : false;
};

export const isPanControl = (controlType: CameraControlsType): boolean => {
  return controlType === 'pan' ? true : false;
};

export const isImmersiveControl = (controlType: CameraControlsType): boolean => {
  return controlType === 'immersive' ? true : false;
};

export const isOrbitOrPanControl = (controlType: CameraControlsType): boolean => {
  return isOrbitControl(controlType) || isPanControl(controlType) ? true : false;
};

export const isPointerLockControlImpl = (controler: CameraControlImpl): boolean => {
  return controler instanceof PointerLockControls ? true : false;
};

// note that MapControls is an extension of OrbitControls soMapControls will return true here also
export const isOrbitControlImpl = (controler: CameraControlImpl): boolean => {
  return controler instanceof OrbitControls ? true : false;
};

export const isPanControlImpl = (controler: CameraControlImpl): boolean => {
  return controler instanceof MapControls ? true : false;
};

export const isOrbitOrPanControlImpl = (controler: CameraControlImpl): boolean => {
  return isOrbitControlImpl(controler) || isPanControlImpl(controler) ? true : false;
};
