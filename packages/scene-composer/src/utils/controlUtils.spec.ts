import * as THREE from 'three';

import { MapControls, OrbitControls } from '../three/OrbitControls';
import { PointerLockControls } from '../three/PointerLockControls';

import {
  isImmersiveControl,
  isPanControl,
  isPointerLockControl,
  isOrbitControl,
  isOrbitOrPanControl,
  isOrbitControlImpl,
  isPanControlImpl,
  isPointerLockControlImpl,
  isOrbitOrPanControlImpl,
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
describe('control implementation utils', () => {
  const camera = new THREE.PerspectiveCamera();
  const orbit = new OrbitControls(camera);
  const pan = new MapControls(camera);
  const pointerLock = new PointerLockControls(camera);
  it('should detect orbit correctly', () => {
    expect(isOrbitControlImpl(orbit)).toBeTruthy();
    //map is a extension of orbit
    expect(isOrbitControlImpl(pan)).toBeTruthy();
    expect(isOrbitControlImpl(pointerLock)).toBeFalsy();
  });
  it('should detect pan correctly', () => {
    expect(isPanControlImpl(orbit)).toBeFalsy();
    expect(isPanControlImpl(pan)).toBeTruthy();
    expect(isPanControlImpl(pointerLock)).toBeFalsy();
  });
  it('should detect pointer lock correctly', () => {
    expect(isPointerLockControlImpl(orbit)).toBeFalsy();
    expect(isPointerLockControlImpl(pan)).toBeFalsy();
    expect(isPointerLockControlImpl(pointerLock)).toBeTruthy();
  });
  it('should detect pan or orbit correctly', () => {
    expect(isOrbitOrPanControlImpl(orbit)).toBeTruthy();
    expect(isOrbitOrPanControlImpl(pan)).toBeTruthy();
    expect(isOrbitOrPanControlImpl(pointerLock)).toBeFalsy();
  });
});
