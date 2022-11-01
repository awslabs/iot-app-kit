/**
 * This file contains the model of the scene file stored in database.
 * Changes to this file should be backward compatible.
 */

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

export interface ValueDataBinding {
  dataBindingContext: unknown;
}

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
    Tag = 'Tag',
    ModelShader = 'ModelShader',
    OpacityFilter = 'OpacityFilter',
    MotionIndicator = 'MotionIndicator',
    Space = 'Space',
  }

  export interface IComponent {
    type: Type | string;
  }

  export interface IDataBindingRuleMap {
    valueDataBinding?: ValueDataBinding;
    ruleBasedMapId?: string;
  }

  export interface Space extends IComponent {
    spaceId: string;
    parentSpaceEntityId: string;
    bounds: Vector3;
    boundsOffset: Vector3;
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

  export interface Camera extends IComponent {
    cameraIndex: number;
  }

  export interface Tag extends IComponent, IDataBindingRuleMap {
    icon?: string;
    navLink?: NavLink;
    offset?: Vector3;
  }

  export interface ModelShader extends IComponent, IDataBindingRuleMap {}
  export interface OpacityFilter extends IComponent, IDataBindingRuleMap {}

  export interface IMotionIndicatorConfig {
    numOfRepeatInY: number;
    backgroundColorOpacity: number;
    defaultBackgroundColor?: Color;
    defaultForegroundColor?: Color;
    defaultSpeed?: number;
  }
  export interface ILinearPlaneMotionIndicatorConfig extends IMotionIndicatorConfig {}

  export interface ILinearCylinderMotionIndicatorConfig extends IMotionIndicatorConfig {}

  export interface ICircularCylinderMotionIndicatorConfig extends IMotionIndicatorConfig {}

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

  export interface ILightShadowSettings {
    shadowBias?: number;
    shadowCameraLeft?: number;
    shadowCameraRight?: number;
    shadowCameraTop?: number;
    shadowCameraBottom?: number;
    shadowMapSizeWidth?: number;
    shadowMapSizeHeight?: number;
  }

  export interface IDirectionalLightSettings {
    color: Color;
    intensity: number;

    castShadow: boolean;
    shadow?: ILightShadowSettings;
  }

  export interface IPointLightSettings {
    color: Color;
    intensity: number;
    // Maximum range of the light. Default is 0 (no limit).
    distance?: number;
    // The amount the light dims along the distance of the light. Default is 1.
    // For physically correct lighting, set this to 2.
    decay?: number;

    castShadow: boolean;
    shadow?: ILightShadowSettings;
  }

  export interface IAmbientLightSettings {
    color: Color;
    intensity: number;
  }

  export interface IHemisphereLightSettings {
    color: Color;
    groundColor: Color;
    intensity: number;
  }

  export interface Light extends IComponent {
    lightType: LightType;
    lightSettings: IDirectionalLightSettings | IAmbientLightSettings | IHemisphereLightSettings;
  }
}
