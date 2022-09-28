/**
 * This file contains public interfaces of the scene content the SceneComposer exposes.
 * It is different from the serialization format from the GLTF Toolkit package.
 * These interfaces are used to interact with the SceneComposer instance at
 * runtime, thus the data structure is slightly different from the GLTF Toolkit.
 */

import { ReactElement } from 'react';

import { ISceneNodeInternal } from '../store/Store';

import { ISceneComponent, KnownComponentType } from './components';
import { IRuleBasedMap, ITransform, ITransformConstraint, Vector3 } from './dataTypes';

/************************************************
 * Scene document, entity, component models
 ************************************************/

export interface ISceneDocumentSnapshot {
  /**
   * Serialize the current document snapshot into a document string with the
   * given format version.
   *
   * Note that this interface is not optimized for very large scene, which
   * we may introduce new APIs later to use stream API to handle the output.
   *
   * TODO: do we want to allow updating the document version?
   * [Option 1]: Externalize the document version instea of keeping the doucment version in the document itself.
   * [Option 2]: Allow passing in a parameter to set the document version.
   * [Option 3]: Automatically increment the document version by 1 based on the original input document version.
   *
   * We'll go with option 1 for now for simplicity.
   *
   * TODO: what should we return when the scene is empty?
   * [Option 1]: Return a falsy value, such as empty string.
   * [Option 2]: Return a valid scene with no entity.
   *
   * We'll go with option 2 for now.
   *
   * @param specVersion - version of the document format
   */
  serialize(specVersion: string): string;
}

export interface ISceneDocument {
  nodeMap: Record<string, ISceneNode>;
  ruleMap: Record<string, IRuleBasedMap>;
  rootNodeRefs: string[];
  unit?: string;
  version: string;
  properties?: Record<string, any>;
  specVersion?: string;
}

export interface ISceneNode {
  // ref is optional when used in APIs to create nodes
  ref?: string;
  name?: string;
  transform?: ITransform;
  transformConstraint?: ITransformConstraint;
  components?: ISceneComponent[];
  parentRef?: string;
  childRefs?: string[];
  properties?: Record<string, any>;
}

export enum KnownSceneProperty {
  BaseUrl = 'baseUrl',
  EnvironmentPreset = 'environmentPreset',
  DataBindingConfig = 'dataBindingConfig',
}

/************************************************
 * Scene Composer Control APIs
 ************************************************/

export type CameraControlMode = 'transition' | 'teleport';
export type CameraControlsType = 'orbit' | 'pan' | 'immersive';
export type TransformControlMode = 'translate' | 'rotate' | 'scale';
export enum CameraViewAxisValues {
  Front = 'front',
  Back = 'back',
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

// an object ref or a precise camera setting
export type FixedCameraTarget = { position: Vector3; target: Vector3 };
export type NamedCameraTarget = string;
export type CameraTarget = NamedCameraTarget | FixedCameraTarget;

export type URIModifier = (uri: string) => string;

export type CreateErrorViewCallback = (error: Error) => ReactElement;

/************************************************
 * Scene Namespace
 ************************************************/

const IotTwinMakerNamespace = 'iottwinmaker.common';
export const IotTwinMakerNamespaceSeparator = ':';
export const IotTwinMakerIconNamespace = `${IotTwinMakerNamespace}.icon`;
export const IotTwinMakerColorNamespace = `${IotTwinMakerNamespace}.color`;
export const IotTwinMakerNumberNamespace = `${IotTwinMakerNamespace}.number`;
export const IotTwinMakerOpacityNamespace = `${IotTwinMakerNamespace}.opacity`;

/************************************************
 * Scene Resource
 ************************************************/

export enum SceneResourceType {
  Icon = 'Icon',
  Color = 'Color',
  Number = 'Number',
  Opacity = 'Opacity',
}

export interface SceneResourceInfo {
  type: SceneResourceType;
  value: string;
}

export interface AddingWidgetInfo {
  type?: KnownComponentType;
  node: ISceneNodeInternal;
}
