import * as THREE from 'three';
import { REVISION } from 'three';

import { type Component, LightType } from '../models/SceneModels';
import {
  InfoIconSvgString,
  WarningIconSvgString,
  ErrorIconSvgString,
  VideoIconSvgString,
  CustomIconSvgString,
} from '../assets';
import {
  type IValueDataBindingProviderState,
  DefaultAnchorStatus,
  type DistanceUnit,
  type Vector3,
  type ITagSettings,
  type IOverlaySettings,
} from '../interfaces';
import { type MapControls as MapControlsImpl, type OrbitControls as OrbitControlsImpl } from '../three/OrbitControls';

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

export const MAX_CLICK_DISTANCE = 2;

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
  color: '#ffffff',
  intensity: 1,
  castShadow: true,
};

const DEFAULT_POINT_LIGHT_SETTINGS: Component.IPointLightSettings = {
  color: '#ffffff',
  intensity: 1,
  decay: 2.0,
  distance: 0,
  castShadow: true,
};

const DEFAULT_AMBIENT_LIGHT_SETTINGS: Component.IAmbientLightSettings = {
  color: '#ffffff',
  intensity: 1,
};

const DEFAULT_HEMISPHERE_LIGHT_SETTINGS: Component.IHemisphereLightSettings = {
  color: '#ffffff',
  groundColor: '#333333',
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
  [DefaultAnchorStatus.Custom]: CustomIconSvgString,
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

export const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;

export const DEFAULT_TAG_GLOBAL_SETTINGS: ITagSettings = {
  autoRescale: false,
  scale: 1,
  enableOcclusion: false,
};

export const DEFAULT_OVERLAY_GLOBAL_SETTINGS: IOverlaySettings = {
  overlayPanelVisible: false,
};

/******************************************************************************
 * Camera Constants
 ******************************************************************************/
export const DEFAULT_ORBIT_CAMERA_CONTROLS_OPTIONS: Pick<
  OrbitControlsImpl | MapControlsImpl,
  'dampingFactor' | 'maxDistance' | 'minDistance'
> = {
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

export const FONT_AWESOME_PREFIX = 'fas';

/******************************************************************************
 * Matterport Constants
 ******************************************************************************/
export const SECRET_MANAGER_MATTERPORT_TAG = 'AWSIoTTwinMaker_Matterport';
export const MATTERPORT_ACCESS_TOKEN = 'MATTERPORT_ACCESS_TOKEN';
export const MATTERPORT_APPLICATION_KEY = 'MATTERPORT_APPLICATION_KEY';
export const MATTERPORT_ERROR = 'MATTERPORT_ERROR';
export const MATTERPORT_FONTID_PROPERTY = 'fontId';
