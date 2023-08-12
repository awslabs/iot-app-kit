import React, { useMemo } from 'react';
import { Color } from 'three';
import { Primitive } from '@iot-app-kit/core';

import { ISceneNodeInternal, IMotionIndicatorComponentInternal, useStore, useViewOptionState } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';
import { Component } from '../../../models/SceneModels';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../utils/dataBindingUtils';
import { getSceneResourceInfo, parseColorWithAlpha } from '../../../utils/sceneResourceUtils';
import { IValueDataBinding, KnownComponentType, SceneResourceType } from '../../../interfaces';
import useBindingData from '../../../hooks/useBindingData';

import { LinearPlaneMotionIndicator } from './LinearPlaneMotionIndicator';
import { LinearCylinderMotionIndicator } from './LinearCylinderMotionIndicator';
import { CircularCylinderMotionIndicator } from './CircularCylinderMotionIndicator';

interface IMotionIndicatorComponentProps {
  node: ISceneNodeInternal;
  component: IMotionIndicatorComponentInternal;
}

const MotionIndicatorComponent: React.FC<IMotionIndicatorComponentProps> = ({
  node,
  component,
}: IMotionIndicatorComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  const motionIndicatorVisible =
    useViewOptionState(sceneComposerId).componentVisibilities[KnownComponentType.MotionIndicator];

  const dataInput = useStore(sceneComposerId)((state) => state.dataInput);
  const dataBindingTemplate = useStore(sceneComposerId)((state) => state.dataBindingTemplate);
  const speedRule = useStore(sceneComposerId)((state) =>
    state.getSceneRuleMapById(
      component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]?.ruleBasedMapId,
    ),
  );
  const foregroundColorRule = useStore(sceneComposerId)((state) =>
    state.getSceneRuleMapById(
      component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]?.ruleBasedMapId,
    ),
  );
  const backgroundColorRule = useStore(sceneComposerId)((state) =>
    state.getSceneRuleMapById(
      component.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]?.ruleBasedMapId,
    ),
  );

  const orderedBindingNames = useMemo(() => Object.keys(component.valueDataBindings), [component.valueDataBindings]);
  const orderedBindings: IValueDataBinding[] = useMemo(
    () => orderedBindingNames.map((name) => component.valueDataBindings[name].valueDataBinding),
    [orderedBindingNames, component.valueDataBindings],
  );
  const orderedBindingData = useBindingData(orderedBindings);

  const speed = useMemo(() => {
    if (
      component.config.defaultSpeed !== undefined &&
      !component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]?.ruleBasedMapId
    ) {
      return component.config.defaultSpeed;
    }

    const bindingIndex = orderedBindingNames.indexOf(Component.MotionIndicatorDataBindingName.Speed);
    const bindingData = orderedBindingData.data?.at(bindingIndex);

    const values: Record<string, Primitive> =
      bindingData ??
      dataBindingValuesProvider(
        dataInput,
        component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]?.valueDataBinding,
        dataBindingTemplate,
      );

    const result = ruleEvaluator(0, values, speedRule) as number;
    return result >= 0 ? result : 0;
  }, [
    speedRule,
    orderedBindingData,
    orderedBindingNames,
    dataInput,
    component.valueDataBindings[Component.MotionIndicatorDataBindingName.Speed]?.valueDataBinding,
    component.config.defaultSpeed,
  ]);

  const foregroundColor = useMemo(() => {
    const defaultColor = component.config.defaultForegroundColor;

    if (
      defaultColor !== undefined &&
      !component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]?.ruleBasedMapId
    ) {
      return new Color(defaultColor);
    }

    const bindingIndex = orderedBindingNames.indexOf(Component.MotionIndicatorDataBindingName.ForegroundColor);
    const bindingData = orderedBindingData.data?.at(bindingIndex);

    const values: Record<string, Primitive> =
      bindingData ??
      dataBindingValuesProvider(
        dataInput,
        component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]?.valueDataBinding,
        dataBindingTemplate,
      );
    const result = ruleEvaluator('', values, foregroundColorRule);
    const ruleTargetInfo = getSceneResourceInfo(result as string);

    return ruleTargetInfo.type === SceneResourceType.Color
      ? parseColorWithAlpha(ruleTargetInfo.value)?.color
      : defaultColor
      ? new Color(defaultColor)
      : undefined;
  }, [
    foregroundColorRule,
    orderedBindingData,
    orderedBindingNames,
    dataInput,
    component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor]?.valueDataBinding,
    component.config.defaultForegroundColor,
  ]);

  const backgroundColor = useMemo(() => {
    const defaultColor = component.config.defaultBackgroundColor;
    if (
      defaultColor !== undefined &&
      !component.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]?.ruleBasedMapId
    ) {
      return new Color(defaultColor);
    }

    const bindingIndex = orderedBindingNames.indexOf(Component.MotionIndicatorDataBindingName.BackgroundColor);
    const bindingData = orderedBindingData.data?.at(bindingIndex);

    const values: Record<string, Primitive> =
      bindingData ??
      dataBindingValuesProvider(
        dataInput,
        component.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]?.valueDataBinding,
        dataBindingTemplate,
      );
    const result = ruleEvaluator('', values, backgroundColorRule);
    const ruleTargetInfo = getSceneResourceInfo(result as string);

    return ruleTargetInfo.type === SceneResourceType.Color
      ? parseColorWithAlpha(ruleTargetInfo.value)?.color
      : defaultColor
      ? new Color(defaultColor)
      : undefined;
  }, [
    backgroundColorRule,
    orderedBindingData,
    orderedBindingNames,
    dataInput,
    component.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor]?.valueDataBinding,
    component.config.defaultBackgroundColor,
  ]);

  return (
    <group name={getComponentGroupName(node.ref, 'MOTION_INDICATOR')} visible={motionIndicatorVisible}>
      {component.shape === 'LinearPlane' && (
        <LinearPlaneMotionIndicator
          speed={speed}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          config={component.config as Component.ILinearPlaneMotionIndicatorConfig}
          scale={node.transform.scale}
        />
      )}
      {component.shape === 'LinearCylinder' && (
        <LinearCylinderMotionIndicator
          speed={speed}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          config={component.config as Component.ILinearCylinderMotionIndicatorConfig}
          scale={node.transform.scale}
        />
      )}
      {component.shape === 'CircularCylinder' && (
        <CircularCylinderMotionIndicator
          speed={speed}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          config={component.config as Component.ICircularCylinderMotionIndicatorConfig}
          scale={node.transform.scale}
        />
      )}
    </group>
  );
};

export default MotionIndicatorComponent;
