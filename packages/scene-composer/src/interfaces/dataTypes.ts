import type * as SceneModels from '../models/SceneModels';

/************************************************
 * General data types
 ************************************************/

export type Vector3 = SceneModels.Vector3;
export type DistanceUnit = SceneModels.DistanceUnit;
export enum DistanceUnits {
  millimeters = 'millimeters',
  centimeters = 'centimeters',
  decimeters = 'decimeters',
  meters = 'meters',
  kilometers = 'kilometers',
  inches = 'inches',
  feet = 'feet',
  yards = 'yards',
  miles = 'miles',
}

export interface IOrientation {
  position: Vector3;
  rotation: Vector3;
}

export interface ITransform {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface ITransformConstraint {
  snapToFloor?: boolean;
}

export type { ITwinMakerEntityDataBindingContext, IValueDataBinding } from '@iot-app-kit/source-iottwinmaker';
export interface TargetMetadata {
  color?: string;
  iconPrefix?: string;
  iconName?: string;
}

export interface INavLink {
  destination?: string;
  params?: Record<string, any>;
}

export interface IRuleStatement {
  expression: string;
  target: string;
  targetMetadata?: TargetMetadata;
}

export interface IRuleBasedMap {
  statements: IRuleStatement[];
}
