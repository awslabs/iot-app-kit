import * as THREE from 'three';

import {
  DefaultAnchorStatus,
  IotTwinMakerColorNamespace,
  IotTwinMakerIconNamespace,
  IotTwinMakerNamespaceSeparator,
  IotTwinMakerNumberNamespace,
  IotTwinMakerOpacityNamespace,
  SceneResourceInfo,
  SceneResourceType,
} from '../interfaces';

import { colors } from './styleUtils';

export const convertToIotTwinMakerNamespace = (type: SceneResourceType, value: string): string => {
  switch (type) {
    case SceneResourceType.Icon:
      return `${IotTwinMakerIconNamespace}${IotTwinMakerNamespaceSeparator}${value}`;
    case SceneResourceType.Color:
      return `${IotTwinMakerColorNamespace}${IotTwinMakerNamespaceSeparator}${value}`;
    case SceneResourceType.Opacity:
      return `${IotTwinMakerOpacityNamespace}${IotTwinMakerNamespaceSeparator}${value}`;
    default:
      return value;
  }
};

export const getSceneResourceDefaultValue = (type: SceneResourceType): string => {
  switch (type) {
    case SceneResourceType.Icon:
      return DefaultAnchorStatus.Info;
    case SceneResourceType.Color:
      return colors.errorRed;
    case SceneResourceType.Number:
      return IotTwinMakerNumberNamespace;
    case SceneResourceType.Opacity:
      return '1';
  }
};

export const getSceneResourceInfo = (target: string | undefined): SceneResourceInfo => {
  const map = {
    [IotTwinMakerIconNamespace + IotTwinMakerNamespaceSeparator]: SceneResourceType.Icon,
    [IotTwinMakerColorNamespace + IotTwinMakerNamespaceSeparator]: SceneResourceType.Color,
    [IotTwinMakerNumberNamespace]: SceneResourceType.Number,
    [IotTwinMakerOpacityNamespace + IotTwinMakerNamespaceSeparator]: SceneResourceType.Opacity,
  };

  let type = SceneResourceType.Icon;
  let value = getSceneResourceDefaultValue(type);

  if (target && typeof target === 'string') {
    const mapKey = Object.keys(map).find((key) => target.startsWith(key));
    if (mapKey) {
      type = map[mapKey];
      const newValue = target.substring(mapKey.length);

      switch (type) {
        case SceneResourceType.Icon:
          value = DefaultAnchorStatus[newValue] ?? getSceneResourceDefaultValue(type);
          break;
        case SceneResourceType.Color:
          value = newValue && newValue.length > 0 ? newValue : getSceneResourceDefaultValue(type);
          break;
        default:
          value = newValue || getSceneResourceDefaultValue(type);
      }
    }
  }

  return { type, value };
};

/**
 * ThreeJS Color does not support alpha value, however, we can use it to indicate a transparent
 * Model Shader. This function extracts the alpha channel value in the style string before sending
 * the value to the ThreeJS color and return both the color and alpha value.
 *
 * @param style - a string represents color can be anything supported by threejs
 * @returns a color and an alpha value parsed from the style
 */
export function parseColorWithAlpha(style: string): { color?: THREE.Color; alpha?: number } | undefined {
  let m: RegExpExecArray | null;
  if ((m = /^((?:rgb|hsl)a)\(([^)]*)\)/.exec(style))) {
    // rgb / hsl

    let color: RegExpExecArray | null;
    const name = m[1];
    const components = m[2];

    switch (name) {
      case 'rgba':
        if ((color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
          // rgb(255,0,0) rgba(255,0,0,0.5)
          const r = Math.min(255, parseInt(color[1], 10)) / 255;
          const g = Math.min(255, parseInt(color[2], 10)) / 255;
          const b = Math.min(255, parseInt(color[3], 10)) / 255;

          return { color: new THREE.Color(r, g, b), alpha: Number(color[4]) };
        }

        if ((color = /^\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
          // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
          const r = Math.min(100, parseInt(color[1], 10)) / 100;
          const g = Math.min(100, parseInt(color[2], 10)) / 100;
          const b = Math.min(100, parseInt(color[3], 10)) / 100;

          return { color: new THREE.Color(r, g, b), alpha: Number(color[4]) };
        }

        break;

      case 'hsla':
        if ((color = /^\s*(\d*\.?\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
          // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
          const h = parseFloat(color[1]) / 360;
          const s = parseInt(color[2], 10) / 100;
          const l = parseInt(color[3], 10) / 100;

          return { color: new THREE.Color().setHSL(h, s, l), alpha: Number(color[4]) };
        }

        break;
    }
  } else {
    return { color: new THREE.Color(style), alpha: 1 };
  }
}
