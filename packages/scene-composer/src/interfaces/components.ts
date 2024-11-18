import type * as SceneModels from '../models/SceneModels';

/************************************************
 * Components
 ************************************************/

import { type DistanceUnit, type INavLink, type IValueDataBinding, type Vector3 } from './dataTypes';

export enum KnownComponentType {
  ModelRef = 'ModelRef',
  SubModelRef = 'SubModelRef',
  Camera = 'Camera',
  Light = 'Light',

  Animation = 'Animation',
  Tag = 'Tag',
  ModelShader = 'ModelShader',
  MotionIndicator = 'MotionIndicator',
  DataOverlay = 'DataOverlay',
  EntityBinding = 'EntityBinding',
  PlaneGeometry = 'PlaneGeometry',
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
  selector: string;
}

export interface IAnchorComponent extends ISceneComponent {
  icon?: string;
  valueDataBinding?: IValueDataBinding;
  ruleBasedMapId?: string;
  navLink?: INavLink;
  offset?: Vector3;
  chosenColor?: string;
  customIcon?: SceneModels.IIconLookup;
}

export interface IAnimationComponent extends ISceneComponent {
  uri: string;
  currentAnimations: string[];
}
/**
 * Default Anchor status strings
 */
export enum DefaultAnchorStatus {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Video = 'Video',
  Custom = 'Custom',
}

/**
 * Selected Anchor string
 */
export const SelectedAnchor = 'Selected';

/**
 * Additional Tag Component Data to be given when a tag node is clicked or changed
 */
export interface ITagData {
  chosenColor?: string;
  navLink?: INavLink;
  dataBindingContext?: unknown;
  customIcon?: SceneModels.IIconLookup;
}

/**
 * Additional Data binding data which is entityID for TwinMaker usecase
 */
export interface IEntityBindingInfo {
  dataBindingContext?: unknown;
}

export interface IDataOverlayInfo {
  dataBindingContexts?: unknown[];
}

/**
 * Type that can be represented by different additional component data types such as ITagData | IFutureComponentData
 */
export type AdditionalComponentData = ITagData | IEntityBindingInfo | IDataOverlayInfo;

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

export interface ICameraBasics {
  cameraType: SceneModels.CameraType;
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

export interface IDataOverlayComponent extends ISceneComponent, SceneModels.Component.DataOverlay {}

export interface IEntityBindingComponent extends ISceneComponent, SceneModels.Component.EntityBindingComponent {}

export interface IPlaneGeometryComponent extends ISceneComponent, SceneModels.Component.Plane {}
