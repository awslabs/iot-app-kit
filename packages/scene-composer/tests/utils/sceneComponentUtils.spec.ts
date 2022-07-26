import { KnownComponentType } from '../../src';
import { Component } from '../../src/models/SceneModels';
import { isLinearPlaneMotionIndicator } from '../../src/utils/sceneComponentUtils';

describe('isLinearPlaneMotionIndicator', () => {
  it('should return true', () => {
    const mockNode = {
      components: [{ type: KnownComponentType.MotionIndicator, shape: Component.MotionIndicatorShape.LinearPlane }],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as any)).toBeTruthy();
  });

  it('should return false for non linear plane motion indicator', () => {
    const mockNode = {
      components: [{ type: KnownComponentType.MotionIndicator, shape: Component.MotionIndicatorShape.LinearCylinder }],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as any)).toBeFalsy();
  });

  it('should return false for other component', () => {
    const mockNode = {
      components: [{ type: KnownComponentType.Light }],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as any)).toBeFalsy();
  });
});
