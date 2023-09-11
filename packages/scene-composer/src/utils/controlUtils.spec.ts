import {
  isImmersiveControl,
  isPanControl,
  isPointerLockControl,
  isOrbitControl,
  isOrbitOrPanControl,
} from './controlUtils';
describe('control utils', () => {
  it('should detect immersive correctly', () => {
    expect(isImmersiveControl('immersive')).toBeTruthy();
    expect(isImmersiveControl('orbit')).toBeFalsy();
    expect(isImmersiveControl('pan')).toBeFalsy();
    expect(isImmersiveControl('pointerLock')).toBeFalsy();
  });
  it('should detect orbit correctly', () => {
    expect(isOrbitControl('immersive')).toBeFalsy();
    expect(isOrbitControl('orbit')).toBeTruthy();
    expect(isOrbitControl('pan')).toBeFalsy();
    expect(isOrbitControl('pointerLock')).toBeFalsy();
  });
  it('should detect pan correctly', () => {
    expect(isPanControl('immersive')).toBeFalsy();
    expect(isPanControl('orbit')).toBeFalsy();
    expect(isPanControl('pan')).toBeTruthy();
    expect(isPanControl('pointerLock')).toBeFalsy();
  });
  it('should detect pointer lock correctly', () => {
    expect(isPointerLockControl('immersive')).toBeFalsy();
    expect(isPointerLockControl('orbit')).toBeFalsy();
    expect(isPointerLockControl('pan')).toBeFalsy();
    expect(isPointerLockControl('pointerLock')).toBeTruthy();
  });
  it('should detect pan or orbit correctly', () => {
    expect(isOrbitOrPanControl('immersive')).toBeFalsy();
    expect(isOrbitOrPanControl('orbit')).toBeTruthy();
    expect(isOrbitOrPanControl('pan')).toBeTruthy();
    expect(isOrbitOrPanControl('pointerLock')).toBeFalsy();
  });
});
