import * as THREE from 'three';

import { Component, LightType } from '../models/SceneModels';
import { InfoIconSvgString, WarningIconSvgString, ErrorIconSvgString, VideoIconSvgString } from '../assets';
import { IValueDataBindingProviderState, DefaultAnchorStatus, DistanceUnit, Vector3 } from '../interfaces';
import { CameraControlImpl } from '../store/internalInterfaces';

/******************************************************************************
 * Document Constants
 ******************************************************************************/

// TODO: [4553] remove in preview build
export const LEGACY_VERSION = '1';

export const CURRENT_MAJOR_VERSION = 1;
export const CURRENT_MINOR_VERSION = 0;
export const CURRENT_VERSION = `${CURRENT_MAJOR_VERSION}.${CURRENT_MINOR_VERSION}`;

// TODO: [4812] replace the url with the actual one
export const AWS_USER_GUIDE_DOC_URL = 'https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html';

/******************************************************************************
 * DataBinding Constants
 ******************************************************************************/
export const DataBindingLabelKeys = {
  entityId: 'entityId',
  componentName: 'componentName',
  propertyName: 'propertyName',
  entityPath: 'entityPath',
  componentTypeId: 'componentTypeId',
};

export const EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE: IValueDataBindingProviderState = {
  definitions: [],
  selectedOptions: [],
};

// For V1, the customer can only use 2 predefined data binding template in scene editor
export const DEFAULT_DATA_BINDING_TEMPLATE_ENTITY_ID = 'sel_entity';
export const DEFAULT_DATA_BINDING_TEMPLATE_COMPONENT_NAME = 'sel_comp';

/******************************************************************************
 * Scene Constants
 ******************************************************************************/
export const DEFAULT_DISTANCE_UNIT: DistanceUnit = 'meters';

export const ROOT_OBJECT_3D_NAME = 'ROOT';

export const DEFAULT_COLOR_MAPS = [
  new THREE.Color('red'),
  new THREE.Color('blue'),
  new THREE.Color('green'),
  new THREE.Color('crimson'),
  new THREE.Color('cyan'),
];

export const DEFAULT_CAMERA_SETTINGS = {
  fov: 53.13,
  near: 0.1,
  far: 1000.0,
  zoom: 1,
};

const DEFAULT_DIRECTIONAL_LIGHT_SETTINGS: Component.IDirectionalLightSettings = {
  color: 0xffffff,
  intensity: 1,
  castShadow: true,
};

const DEFAULT_POINT_LIGHT_SETTINGS: Component.IPointLightSettings = {
  color: 0xffffff,
  intensity: 1,
  decay: 2.0,
  distance: 0,
  castShadow: true,
};

const DEFAULT_AMBIENT_LIGHT_SETTINGS: Component.IAmbientLightSettings = {
  color: 0xffffff,
  intensity: 1,
};

const DEFAULT_HEMISPHERE_LIGHT_SETTINGS: Component.IHemisphereLightSettings = {
  color: 0xffffff,
  groundColor: 0x333333,
  intensity: 1,
};

export const DEFAULT_LIGHT_SETTINGS_MAP = {
  [LightType.Directional]: DEFAULT_DIRECTIONAL_LIGHT_SETTINGS,
  [LightType.Point]: DEFAULT_POINT_LIGHT_SETTINGS,
  [LightType.Hemisphere]: DEFAULT_HEMISPHERE_LIGHT_SETTINGS,
  [LightType.Ambient]: DEFAULT_AMBIENT_LIGHT_SETTINGS,
};

export const SCENE_ICONS: Record<DefaultAnchorStatus, string> = {
  [DefaultAnchorStatus.Info]: InfoIconSvgString,
  [DefaultAnchorStatus.Warning]: WarningIconSvgString,
  [DefaultAnchorStatus.Error]: ErrorIconSvgString,
  [DefaultAnchorStatus.Video]: VideoIconSvgString,
};

export enum RenderOrder {
  DrawEarly = -10,
  Default = 0,
  DrawLate = 10,
}

export enum Layers {
  RaycastAndRender = 0,
  RenderOnly = 1,
}

export const SCENE_BODY_CLASS = 'twinmaker_scene_container';

export const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/';

/******************************************************************************
 * Camera Constants
 ******************************************************************************/
export const DEFAULT_CAMERA_CONTROLS_OPTIONS: Pick<CameraControlImpl, 'dampingFactor' | 'maxDistance' | 'minDistance'> =
  {
    dampingFactor: 0.2,
    maxDistance: Infinity,
    minDistance: 0,
  };
export const DEFAULT_CAMERA_POSITION: Vector3 = [5, 5, 5];
export const DEFAULT_CAMERA_OPTIONS: Pick<THREE.PerspectiveCamera, 'far' | 'fov' | 'near'> = {
  far: 1000,
  fov: 53.13,
  near: 0.1,
};
export const DEFAULT_CAMERA_TARGET: Vector3 = [0, 0, 0];
export const DEFAULT_TWEEN_DURATION = 500;
