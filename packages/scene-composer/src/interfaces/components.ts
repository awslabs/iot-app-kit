import * as SceneModels from '../models/SceneModels';

/************************************************
 * Components
 ************************************************/

import { DistanceUnit, INavLink, IValueDataBinding, Vector3 } from './dataTypes';

export enum KnownComponentType {
  ModelRef = 'ModelRef',
  SubModelRef = 'SubModelRef',
  Camera = 'Camera',
  Light = 'Light',

  Tag = 'Tag',
  ModelShader = 'ModelShader',
  MotionIndicator = 'MotionIndicator',
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

export interface ISubModelRefComponent extends ISceneComponent {
  parentRef?: string;
  selector: string | number;
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
 * Additional Tag Component Data to be given when a tag node is clicked or changed
 */
export interface ITagData {
  navLink?: INavLink;
  dataBindingContext?: unknown;
}

/**
 * Type that can be represented by different additional component data types such as ITagData | IFutureComponentData
 */
export type AdditionalComponentData = ITagData;

/**
 * Callback signature for selection of with Widgets.
 */
export interface ISelectionChangedEvent {
  componentTypes: KnownComponentType[] | string[];
  nodeRef?: string;
  additionalComponentData?: AdditionalComponentData[];
}

/**
 * Callback signature for interaction with Widgets.
 */
export interface IWidgetClickEvent {
  componentTypes: KnownComponentType[] | string[];
  nodeRef: string;
  additionalComponentData?: AdditionalComponentData[];
}

export type WidgetClickEventCallback = (event: IWidgetClickEvent) => void;

export type SelectionChangedEventCallback = (event: ISelectionChangedEvent) => void;

export interface ILightComponent extends ISceneComponent, SceneModels.Component.Light {}

export type CameraType = 'Perspective' | 'Orthographic';

export interface ICameraBasics {
  cameraType: CameraType;
  fov?: number;
  near: number;
  far: number;
  zoom: number;
}

export interface CameraSettings extends ICameraBasics {
  transform: SceneModels.Transform;
}

export interface ICameraComponent extends ISceneComponent, ICameraBasics {}

export interface IColorOverlayComponent extends ISceneComponent {
  valueDataBinding?: IValueDataBinding;
  ruleBasedMapId?: string;
}

export interface IMotionIndicatorComponent extends ISceneComponent, SceneModels.Component.MotionIndicator {}
