/**
 * This file contains the model of the scene file stored in database.
 * Changes to this file should be backward compatible.
 */
import { IValueDataBinding } from '@iot-app-kit/source-iottwinmaker';

export type KeyValuePair = { [key: string]: unknown };
export type UUID = string;
export type Vector3 = [number, number, number];
export type Vector2 = [number, number];
export type Uri = string;

export type DistanceUnit =
  | 'millimeters'
  | 'centimeters'
  | 'decimeters'
  | 'meters'
  | 'kilometers'
  | 'inches'
  | 'feet'
  | 'yards'
  | 'miles';

export type Color = number | string;

export interface GeoLocation {
  longitude: number;
  latitude: number;
  altitude?: number;
}

export interface RuleStatement {
  expression: string;
  target: string;
}

export interface RuleBasedMap {
  statements: Array<RuleStatement>;
}

export type ValueDataBinding = IValueDataBinding;

export interface NavLink {
  destination?: string;
  params?: Record<string, string>;
}

export interface Scene {
  specVersion: string;
  version: string;
  unit?: DistanceUnit;
  nodes: Array<Node>;
  rootNodeIndexes: Array<number>;
  properties?: KeyValuePair;
  rules?: Record<string, RuleBasedMap>;
  cameras?: Array<Camera>;
  defaultCameraIndex?: number;
}

export enum CameraType {
  Perspective = 'Perspective',
  Orthographic = 'Orthographic',
}

export interface Camera {
  cameraType: CameraType;
  fov?: number;
  near?: number;
  far?: number;
}

export enum LightType {
  Ambient = 'Ambient',
  Directional = 'Directional',
  Hemisphere = 'Hemisphere',
  Point = 'Point',
}

export interface Transform {
  position: Vector3;
  rotation?: Vector3; // euler angle
  scale?: Vector3;
}

export interface TransformConstraint {
  snapToFloor?: boolean;
}

export interface Node {
  name?: string;
  transform: Transform;
  transformConstraint?: TransformConstraint;
  components?: Array<Component.IComponent>;
  children?: Array<number>;
  properties?: Record<string, any>;
}

export enum ModelType {
  GLB = 'GLB',
  GLTF = 'GLTF',
  Tiles3D = 'Tiles3D', // 3D Tiles
  Environment = 'Environment', // Environment for external sources
}

export namespace Component {
  export enum Type {
    Camera = 'Camera',
    Light = 'Light',

    ModelRef = 'ModelRef',
    SubModelRef = 'SubModelRef',
    Animation = 'Animation',
    Tag = 'Tag',
    ModelShader = 'ModelShader',
    MotionIndicator = 'MotionIndicator',
    DataOverlay = 'DataOverlay',
    EntityBinding = 'EntityBinding',
  }

  export interface IComponent {
    type: Type | string;
  }

  export interface IDataBindingMap {
    valueDataBinding?: ValueDataBinding;
  }

  export interface IDataBindingRuleMap extends IDataBindingMap {
    ruleBasedMapId?: string;
  }

  export interface ModelRef extends IComponent {
    uri: Uri;
    modelType: ModelType;
    unitOfMeasure?: DistanceUnit;
    localScale?: Vector3;
    castShadow?: boolean;
    receiveShadow?: boolean;
  }

  export interface SubModelRef extends IComponent {
    parentRef: string;
    selector: string | number;
  }

  export interface Animation extends IComponent {
    selector?: number;
    uri: string;
    currentAnimations: string[];
  }

  export interface Camera extends IComponent {
    cameraIndex: number;
  }

  export interface Tag extends IComponent, IDataBindingRuleMap {
    icon?: string;
    navLink?: NavLink;
    offset?: Vector3;
    chosenColor?: string;
  }

  export interface ModelShader extends IComponent, IDataBindingRuleMap {}

  export interface EntityBindingComponent extends IComponent {
    valueDataBinding: ValueDataBinding;
  }

  // Motion Indicator
  export interface IMotionIndicatorConfig {
    numOfRepeatInY: number;
    backgroundColorOpacity: number;
    defaultBackgroundColor?: Color;
    defaultForegroundColor?: Color;
    defaultSpeed?: number;
  }
  export type ILinearPlaneMotionIndicatorConfig = IMotionIndicatorConfig;

  export type ILinearCylinderMotionIndicatorConfig = IMotionIndicatorConfig;

  export type ICircularCylinderMotionIndicatorConfig = IMotionIndicatorConfig;

  export enum MotionIndicatorDataBindingName {
    Speed = 'speed',
    ForegroundColor = 'foregroundColor',
    BackgroundColor = 'backgroundColor',
  }

  export enum MotionIndicatorShape {
    LinearPlane = 'LinearPlane',
    LinearCylinder = 'LinearCylinder',
    CircularCylinder = 'CircularCylinder',
  }

  export interface MotionIndicator extends IComponent {
    valueDataBindings: { [key in MotionIndicatorDataBindingName]?: IDataBindingRuleMap };

    shape: MotionIndicatorShape;
    config:
      | ILinearPlaneMotionIndicatorConfig
      | ILinearCylinderMotionIndicatorConfig
      | ICircularCylinderMotionIndicatorConfig;
  }

  // Data Overlay
  export enum DataOverlayRowType {
    Markdown = 'Markdown',
  }
  export interface DataOverlayRow {
    rowType: DataOverlayRowType;
  }
  export interface DataOverlayMarkdownRow extends DataOverlayRow {
    content: string;
  }
  export enum DataOverlaySubType {
    TextAnnotation = 'TextAnnotation',
    OverlayPanel = 'OverlayPanel',
  }
  // TODO: Not supported in milestone 1
  export interface OverlayPanelConfig {
    isPinned: boolean;
  }

  export interface ValueDataBindingNamedMap extends IDataBindingMap {
    bindingName: string;
  }

  export interface DataOverlay extends IComponent {
    subType: DataOverlaySubType;
    dataRows: Array<DataOverlayMarkdownRow>;

    // TODO: Not supported in milestone 1
    // config?: OverlayPanelConfig;

    valueDataBindings: ValueDataBindingNamedMap[];
  }

  export interface ILightShadowSettings {
    shadowBias?: number;
    shadowCameraLeft?: number;
    shadowCameraRight?: number;
    shadowCameraTop?: number;
    shadowCameraBottom?: number;
    shadowMapSizeWidth?: number;
    shadowMapSizeHeight?: number;
  }

  interface ILightSettingsBase {
    color: Color;
    intensity: number;
  }

  export interface IDirectionalLightSettings extends ILightSettingsBase {
    castShadow: boolean;
    shadow?: ILightShadowSettings;
  }

  export interface IPointLightSettings extends ILightSettingsBase {
    // Maximum range of the light. Default is 0 (no limit).
    distance?: number;
    // The amount the light dims along the distance of the light. Default is 1.
    // For physically correct lighting, set this to 2.
    decay?: number;

    castShadow: boolean;
    shadow?: ILightShadowSettings;
  }

  export interface IAmbientLightSettings extends ILightSettingsBase {}

  export interface IHemisphereLightSettings extends ILightSettingsBase {
    groundColor: Color;
  }

  export interface Light extends IComponent {
    lightType: LightType;
    lightSettings: IDirectionalLightSettings | IAmbientLightSettings | IHemisphereLightSettings | IPointLightSettings;
  }
}
