import { CameraControlsType } from '../interfaces';

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
