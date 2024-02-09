import { KnownComponentType } from '../../src';
import { Component } from '../../src/models/SceneModels';
import { ISceneNodeInternal } from '../../src/store';
import { isLinearPlaneMotionIndicator } from '../../src/utils/sceneComponentUtils';

type componentType = {
  type: KnownComponentType;
  shape: Component.MotionIndicatorShape;
}[];

describe('isLinearPlaneMotionIndicator', () => {
  it('should return true', () => {
    const mockNode = {
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        } as unknown as componentType,
      ],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as unknown as ISceneNodeInternal)).toBeTruthy();
  });

  it('should return false for non linear plane motion indicator', () => {
    const mockNode = {
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearCylinder,
        } as unknown as componentType,
      ],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as unknown as ISceneNodeInternal)).toBeFalsy();
  });

  it('should return false for other component', () => {
    const mockNode = {
      components: [{ type: KnownComponentType.Light } as unknown as componentType],
    };
    expect(isLinearPlaneMotionIndicator(mockNode as unknown as ISceneNodeInternal)).toBeFalsy();
  });
});
