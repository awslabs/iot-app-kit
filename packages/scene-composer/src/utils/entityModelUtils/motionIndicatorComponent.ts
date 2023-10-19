import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';
import { isEmpty } from 'lodash';

import { IMotionIndicatorComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { generateUUID } from '../mathUtils';
import { IMotionIndicatorComponentInternal } from '../../store';
import { Component } from '../../models/SceneModels';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';

enum MotionIndicatorComponentProperty {
  Shape = 'shape',
  ConfigNumOfRepeatInY = 'config_numOfRepeatInY',
  ConfigBackgroundColorOpacity = 'config_backgroundColorOpacity',
  ConfigDefaultSpeed = 'config_defaultSpeed',
  ConfigDefaultBackgroundColor = 'config_defaultBackgroundColor',
  ConfigDefaultForegroundColor = 'config_defaultForegroundColor',
  AppearanceBindings = 'appearanceBindings',
  AppearanceBindingName = 'bindingName',
  AppearanceRuleBasedMapId = 'ruleBasedMapId',
}

export const EMPTY_COLOR_STRING = 'null_color';

export const createMotionIndicatorEntityComponent = (indicator: IMotionIndicatorComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
    properties: {
      [MotionIndicatorComponentProperty.Shape]: {
        value: {
          stringValue: indicator.shape,
        },
      },
      [MotionIndicatorComponentProperty.ConfigNumOfRepeatInY]: {
        value: {
          integerValue: indicator.config.numOfRepeatInY,
        },
      },
      [MotionIndicatorComponentProperty.ConfigBackgroundColorOpacity]: {
        value: {
          doubleValue: indicator.config.backgroundColorOpacity,
        },
      },
      [MotionIndicatorComponentProperty.ConfigDefaultBackgroundColor]: {
        value: {
          stringValue: indicator.config.defaultBackgroundColor ?? EMPTY_COLOR_STRING,
        },
      },
      [MotionIndicatorComponentProperty.ConfigDefaultForegroundColor]: {
        value: {
          stringValue: indicator.config.defaultForegroundColor ?? EMPTY_COLOR_STRING,
        },
      },
    },
  };

  // Empty list cannot be saved to backend
  if (!isEmpty(indicator.valueDataBindings)) {
    comp.properties![MotionIndicatorComponentProperty.AppearanceBindings] = {
      value: {
        listValue: Object.keys(indicator.valueDataBindings).map((k) => {
          const bindings = createDataBindingMap(indicator.valueDataBindings[k]?.valueDataBinding);
          bindings[MotionIndicatorComponentProperty.AppearanceBindingName] = {
            stringValue: k,
          };
          if (indicator.valueDataBindings[k]?.ruleBasedMapId) {
            bindings[MotionIndicatorComponentProperty.AppearanceRuleBasedMapId] = {
              stringValue: indicator.valueDataBindings[k].ruleBasedMapId,
            };
          }
          return {
            mapValue: bindings,
          };
        }),
      },
    };
  }

  if (indicator.config.defaultSpeed !== undefined) {
    comp.properties![MotionIndicatorComponentProperty.ConfigDefaultSpeed] = {
      value: {
        doubleValue: indicator.config.defaultSpeed,
      },
    };
  }

  return comp;
};

export const updateMotionIndicatorEntityComponent = (
  motionIndicator: IMotionIndicatorComponent,
): ComponentUpdateRequest => {
  const request = createMotionIndicatorEntityComponent(motionIndicator);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseMotionIndicatorComp = (comp: DocumentType): IMotionIndicatorComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const shape = comp['properties'].find(
    (p) => p['propertyName'] === MotionIndicatorComponentProperty.Shape,
  )?.propertyValue;
  if (!shape) {
    return undefined;
  }

  const valueDataBindings: { [key in Component.MotionIndicatorDataBindingName]?: Component.IDataBindingRuleMap } = {};
  comp['properties']
    .find((p) => p['propertyName'] === MotionIndicatorComponentProperty.AppearanceBindings)
    ?.propertyValue?.forEach((bindingMap) => {
      valueDataBindings[bindingMap[MotionIndicatorComponentProperty.AppearanceBindingName]] = {};

      const ruleBasedMapId = bindingMap[MotionIndicatorComponentProperty.AppearanceRuleBasedMapId];
      const valueDataBinding = parseDataBinding(bindingMap);

      if (ruleBasedMapId !== undefined) {
        valueDataBindings[bindingMap[MotionIndicatorComponentProperty.AppearanceBindingName]].ruleBasedMapId =
          ruleBasedMapId;
      }

      if (valueDataBinding !== undefined) {
        valueDataBindings[bindingMap[MotionIndicatorComponentProperty.AppearanceBindingName]].valueDataBinding =
          valueDataBinding;
      }

      if (isEmpty(valueDataBindings[bindingMap[MotionIndicatorComponentProperty.AppearanceBindingName]])) {
        valueDataBindings[bindingMap[MotionIndicatorComponentProperty.AppearanceBindingName]] = undefined;
      }
    });

  const motionIndicatorComp: IMotionIndicatorComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.MotionIndicator,
    shape,
    config: {
      numOfRepeatInY: comp['properties'].find(
        (p) => p['propertyName'] === MotionIndicatorComponentProperty.ConfigNumOfRepeatInY,
      )?.propertyValue,
      backgroundColorOpacity: comp['properties'].find(
        (p) => p['propertyName'] === MotionIndicatorComponentProperty.ConfigBackgroundColorOpacity,
      )?.propertyValue,
      defaultSpeed: comp['properties'].find(
        (p) => p['propertyName'] === MotionIndicatorComponentProperty.ConfigDefaultSpeed,
      )?.propertyValue,
      defaultBackgroundColor: comp['properties'].find(
        (p) => p['propertyName'] === MotionIndicatorComponentProperty.ConfigDefaultBackgroundColor,
      )?.propertyValue,
      defaultForegroundColor: comp['properties'].find(
        (p) => p['propertyName'] === MotionIndicatorComponentProperty.ConfigDefaultForegroundColor,
      )?.propertyValue,
    },
    valueDataBindings,
  };

  if (motionIndicatorComp.config.defaultBackgroundColor === EMPTY_COLOR_STRING) {
    motionIndicatorComp.config.defaultBackgroundColor = undefined;
  }
  if (motionIndicatorComp.config.defaultForegroundColor === EMPTY_COLOR_STRING) {
    motionIndicatorComp.config.defaultForegroundColor = undefined;
  }

  return motionIndicatorComp;
};
