import * as SceneModels from '../models/SceneModels';

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

export interface IValueDataBinding {
  dataBindingContext: unknown;
}

export interface ITwinMakerEntityDataBindingContext {
  entityId: string;
  componentName: string;
  propertyName: string;
}

export interface INavLink {
  destination?: string;
  params?: Record<string, any>;
}

export interface IRuleStatement {
  expression: string;
  target: string;
}

export interface IRuleBasedMap {
  statements: IRuleStatement[];
}
