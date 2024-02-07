import { IErrorDetails } from '../common/errors';
import {
  SelectionChangedEventCallback,
  IAnchorComponent,
  ICameraComponent,
  IColorOverlayComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  IRuleBasedMap,
  IRuleStatement,
  ISceneComponent,
  ISceneDocument,
  ISceneNode,
  IAnimationComponent,
  ITransform,
  ITransformConstraint,
  IValueDataBinding,
  IValueDataBindingProvider,
  URIModifier,
  KnownComponentType,
  WidgetClickEventCallback,
  ISubModelRefComponent,
  IDataOverlayComponent,
  IEntityBindingComponent,
  IPlaneGeometryComponent,
} from '../interfaces';
import { OperationMode, ShowAssetBrowserCallback } from '../interfaces/sceneComposerInternal';
import { MapControls as MapControlsImpl, OrbitControls as OrbitControlsImpl } from '../three/OrbitControls';
import { PointerLockControls as PointerLockControlsImpl } from '../three/PointerLockControls';

export type ISerializationErrorDetails = IErrorDetails;

export interface IDeserializationResult {
  document?: ISceneDocumentInternal;
  errors: ISerializationErrorDetails[];
}

/******************************************************************************
 * Editor Data Model
 ******************************************************************************/

export enum DisplayMessageCategory {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}

export type CameraControlImpl = OrbitControlsImpl | MapControlsImpl | PointerLockControlsImpl;
export type TweenValueObject = { x: number; y: number; z: number };

export type CursorStyle = 'move' | 'edit';

export interface IDisplayMessage {
  category: DisplayMessageCategory;
  messageText: string;
  params?: Record<string, string>;
}

export interface IEditorConfig {
  operationMode?: OperationMode;
  uriModifier?: URIModifier;
  valueDataBindingProvider?: IValueDataBindingProvider;
  showAssetBrowserCallback?: ShowAssetBrowserCallback;
  onWidgetClick?: WidgetClickEventCallback;
  onSelectionChanged?: SelectionChangedEventCallback;
}

/******************************************************************************
 * Document Model
 ******************************************************************************/

export type ITransformInternal = ITransform;
export type IRuleBasedMapInternal = IRuleBasedMap;
export type IRuleStatementInternal = IRuleStatement;

// The list os scene node property keys that are for runtime only and are not saved to data base.
export enum SceneNodeRuntimeProperty {
  LayerIds = 'layerIds', // The layer ids that the node is rendered from.
}

export interface ISceneNodeInternal extends ISceneNode {
  // below fields are not nullable internally
  ref: string;
  name: string;
  transform: ITransformInternal;
  transformConstraint: ITransformConstraint;
  components: ISceneComponentInternal[];
  childRefs: string[];
  properties: Partial<
    Record<'alwaysVisible' | 'matterportId' | 'hiddenWhileImmersive', boolean | string> &
      Record<SceneNodeRuntimeProperty, string[]>
  >;
}

export interface ISceneDocumentInternal extends ISceneDocument {
  unit: string; // unit is not nullable internally, default to 'meter'
  ruleMap: Record<string, IRuleBasedMapInternal>;
  nodeMap: Record<string, ISceneNodeInternal>;
  componentNodeMap: { [type in KnownComponentType | string]?: Record<string, string[]> }; // record of node.ref to component.ref[]
}

export interface ISceneComponentInternal extends ISceneComponent {
  // unique id for the component for internal reference
  ref: string;
}

export interface IDataBoundSceneComponentInternal extends ISceneComponentInternal {
  valueDataBinding?: IValueDataBinding;
}

/******************************************************************************
 * Components
 ******************************************************************************/

export type ILightComponentInternal = ISceneComponentInternal & ILightComponent;

export type ICameraComponentInternal = ISceneComponentInternal & ICameraComponent;

export type IModelRefComponentInternal = ISceneComponentInternal & IModelRefComponent;

export type ISubModelRefComponentInternal = ISceneComponentInternal & ISubModelRefComponent;

export type IAnchorComponentInternal = IDataBoundSceneComponentInternal & IAnchorComponent;

export type IAnimationComponentInternal = ISceneComponentInternal & IAnimationComponent;

export type IColorOverlayComponentInternal = IDataBoundSceneComponentInternal & IColorOverlayComponent;

export type IMotionIndicatorComponentInternal = ISceneComponentInternal & IMotionIndicatorComponent;

export type IDataOverlayComponentInternal = ISceneComponentInternal & IDataOverlayComponent;

export type IEntityBindingComponentInternal = IDataBoundSceneComponentInternal & IEntityBindingComponent;

export type IPlaneGeometryComponentInternal = ISceneComponentInternal & IPlaneGeometryComponent;

/******************************************************************************
 * Type magic...
 ******************************************************************************/

export const isISceneNodeInternal = (item: ISceneNodeInternal | undefined): item is ISceneNodeInternal => {
  return !!item;
};

export const isISceneComponentInternal = (
  item: ISceneComponentInternal | undefined,
): item is ISceneComponentInternal => {
  return !!item;
};
