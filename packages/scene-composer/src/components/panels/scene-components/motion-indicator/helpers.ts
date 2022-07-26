import { isEmpty } from 'lodash';

import { Component } from '../../../../models/SceneModels';
import { IMotionIndicatorComponentInternal } from '../../../../store';

export function updateComponentForColorTypeSelection(colorType: string, component: IMotionIndicatorComponentInternal) {
  const valueDataBindings = { ...component.valueDataBindings };
  const config = { ...component.config };
  if (colorType === Component.MotionIndicatorDataBindingName.BackgroundColor) {
    // move the foreground color data binding selections to be used by background color if available.
    if (!isEmpty(component.valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor])) {
      valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor] =
        valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor];
    } else {
      valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor] = {};
    }
    // clear the foreground color relatedd values since background color is preferred.
    valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor] = undefined;
    config.defaultBackgroundColor = config.defaultForegroundColor;
    config.defaultForegroundColor = undefined;
  } else {
    if (!isEmpty(component.valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor])) {
      valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor] =
        valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor];
    } else {
      valueDataBindings[Component.MotionIndicatorDataBindingName.ForegroundColor] = {};
    }
    valueDataBindings[Component.MotionIndicatorDataBindingName.BackgroundColor] = undefined;
    config.defaultForegroundColor = config.defaultBackgroundColor;
    config.defaultBackgroundColor = undefined;
  }
  const updatedComponent = { ...component, valueDataBindings, config };
  return updatedComponent;
}
