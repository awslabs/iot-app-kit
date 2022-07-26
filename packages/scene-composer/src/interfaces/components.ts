import * as SceneModels from '../models/SceneModels';

/************************************************
 * Components
 ************************************************/

import { DistanceUnit, INavLink, IValueDataBinding, Vector3 } from './dataTypes';

export enum KnownComponentType {
  ModelRef = 'ModelRef',
  Camera = 'Camera',
  Light = 'Light',

  Tag = 'Tag',
  ModelShader = 'ModelShader',
  MotionIndicator = 'MotionIndicator',
  Viewpoint = 'Viewpoint',
}

export interface ISceneComponent {
  // ref is optional when used in APIs to create components
  ref?: string;
  type: KnownComponentType | string;
}

export interface IModelRefComponent extends ISceneComponent {
  uri: string;
  modelType: string;

  unitOfMeasure?: DistanceUnit;
  localScale?: Vector3;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface IAnchorComponent extends ISceneComponent {
  icon?: string;
  valueDataBinding?: IValueDataBinding;
  ruleBasedMapId?: string;
  navLink?: INavLink;
  offset?: Vector3;
}

/**
 * Default Anchor status strings
 */
export enum DefaultAnchorStatus {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Video = 'Video',
}

/**
 * Selected Anchor string
 */
export const SelectedAnchor = 'Selected';

/**
 * Callback signature for interaction with Widgets.
 */
export interface IAnchorEvent {
  eventType: 'click' | 'change';
  anchorNodeRef: string;
  isSelected?: boolean;
  navLink?: INavLink;
  dataBindingContext?: unknown;
}

export type AnchorEventCallback = (event: IAnchorEvent) => void;

export interface ILightComponent extends ISceneComponent, SceneModels.Component.Light {}

export type CameraType = 'Perspective' | 'Orthographic';

export interface ICameraComponent extends ISceneComponent {
  cameraType: CameraType;
  fov?: number;
  near: number;
  far: number;
}

export interface IColorOverlayComponent extends ISceneComponent {
  valueDataBinding?: IValueDataBinding;
  ruleBasedMapId?: string;
}

export interface IMotionIndicatorComponent extends ISceneComponent, SceneModels.Component.MotionIndicator {}
export interface IViewpointComponent extends ISceneComponent, SceneModels.Component.Viewpoint {}
