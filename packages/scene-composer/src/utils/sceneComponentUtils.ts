import { KnownComponentType } from '../interfaces';
import { Component } from '../models/SceneModels';
import { IMotionIndicatorComponentInternal, ISceneNodeInternal } from '../store/internalInterfaces';

export function isLinearPlaneMotionIndicator(node: ISceneNodeInternal): boolean {
  const indicatorComponent = node.components.find(
    (comp) => comp.type === KnownComponentType.MotionIndicator,
  ) as IMotionIndicatorComponentInternal;
  return indicatorComponent && indicatorComponent.shape === Component.MotionIndicatorShape.LinearPlane;
}
