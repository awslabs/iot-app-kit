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
  ITransform,
  ITransformConstraint,
  IValueDataBinding,
  IValueDataBindingProvider,
  OperationMode,
  ShowAssetBrowserCallback,
  URIModifier,
  KnownComponentType,
  WidgetClickEventCallback,
  ISubModelRefComponent,
  IDataOverlayComponent,
} from '../interfaces';
import { MapControls as MapControlsImpl, OrbitControls as OrbitControlsImpl } from '../three/OrbitControls';

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

export type CameraControlImpl = MapControlsImpl | OrbitControlsImpl;
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

export interface ISceneNodeInternal extends ISceneNode {
  // below fields are not nullable internally
  ref: string;
  name: string;
  transform: ITransformInternal;
  transformConstraint: ITransformConstraint;
  components: ISceneComponentInternal[];
  childRefs: string[];
  properties: Record<string, any>;
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

export type IColorOverlayComponentInternal = IDataBoundSceneComponentInternal & IColorOverlayComponent;

export type IMotionIndicatorComponentInternal = ISceneComponentInternal & IMotionIndicatorComponent;

export type IDataOverlayComponentInternal = ISceneComponentInternal & IDataOverlayComponent;

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
