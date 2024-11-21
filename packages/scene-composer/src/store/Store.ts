import { create, type StoreApi, type UseBoundStore } from 'zustand';
import shallow from 'zustand/shallow';
import {
  isISceneComponentInternal,
  isISceneNodeInternal,
  type IAnchorComponentInternal,
  type IAnimationComponentInternal,
  type ICameraComponentInternal,
  type IColorOverlayComponentInternal,
  type IDataOverlayComponentInternal,
  type IEntityBindingComponentInternal,
  type ILightComponentInternal,
  type IModelRefComponentInternal,
  type IMotionIndicatorComponentInternal,
  type IPlaneGeometryComponentInternal,
  type ISceneComponentInternal,
  type ISceneDocumentInternal,
  type ISceneNodeInternal,
  type ISubModelRefComponentInternal,
} from './internalInterfaces';
import { immer, log, undoMiddleware, type UndoState } from './middlewares';
import { createDataStoreSlice, type IDataStoreSlice } from './slices/DataStoreSlice';
import { createEditStateSlice, type IEditorStateSlice } from './slices/EditorStateSlice';
import { createNodeErrorStateSlice, type INodeErrorStateSlice } from './slices/NodeErrorStateSlice';
import { createSceneDocumentSlice, type ISceneDocumentSlice } from './slices/SceneDocumentSlice';
import { createViewOptionStateSlice, type IViewOptionStateSlice } from './slices/ViewOptionStateSlice';
import { type SceneComposerOperation } from './StoreOperations';

export type {
  IAnchorComponentInternal,
  IAnimationComponentInternal,
  ICameraComponentInternal,
  IColorOverlayComponentInternal,
  IDataOverlayComponentInternal,
  IEntityBindingComponentInternal,
  ILightComponentInternal,
  // Components
  IModelRefComponentInternal,
  IMotionIndicatorComponentInternal,
  IPlaneGeometryComponentInternal,
  ISceneComponentInternal,
  // Document
  ISceneDocumentInternal,
  ISceneNodeInternal,
  ISubModelRefComponentInternal,
};

export interface ISharedState {
  lastOperation?: SceneComposerOperation;
  noHistoryStates: IViewOptionStateSlice;
}

export type RootState = ISharedState &
  ISceneDocumentSlice &
  IEditorStateSlice &
  IDataStoreSlice &
  UndoState &
  INodeErrorStateSlice;

/**
 * Core state management functions
 * TODO: make them into slices and better organized
 */
const stateCreator = (
  set: (cb: (draft: RootState) => void) => void,
  get: StoreApi<RootState>['getState'],
  api: StoreApi<RootState>,
) => ({
  lastOperation: undefined,
  ...createSceneDocumentSlice(set, get),
  ...createEditStateSlice(set, get, api),
  ...createDataStoreSlice(set, get, api),
  noHistoryStates: {
    ...createViewOptionStateSlice(set),
  },
  ...createNodeErrorStateSlice(set, get, api),
});

const createStateImpl: () => UseBoundStore<StoreApi<RootState>> = () =>
  create<RootState>(undoMiddleware(log(immer(stateCreator))));

// TODO: currently undoMiddleware will record editor state changes, such as select/deselect object.
// We may want to fine-tune the undo/redo experience.
const stores = new Map<string, UseBoundStore<StoreApi<RootState>>>();

const accessStore: (id: string) => UseBoundStore<StoreApi<RootState>> = (id: string) => {
  if (!stores.has(id)) {
    stores.set(id, createStateImpl());
  }
  return stores.get(id)!;
};

const sceneDocumentSelector = (state: RootState) => ({
  document: state.document,
  sceneLoaded: state.sceneLoaded,
  getSceneNodeByRef: state.getSceneNodeByRef,
  getSceneNodesByRefs: state.getSceneNodesByRefs,
  appendSceneNodeInternal: state.appendSceneNodeInternal,
  updateSceneNodeInternal: state.updateSceneNodeInternal,
  updateDocumentInternal: state.updateDocumentInternal,
  listSceneRuleMapIds: state.listSceneRuleMapIds,
  getSceneRuleMapById: state.getSceneRuleMapById,
  updateSceneRuleMapById: state.updateSceneRuleMapById,
  removeSceneRuleMapById: state.removeSceneRuleMapById,
  getSceneProperty: state.getSceneProperty,
  removeSceneNode: state.removeSceneNode,
});

const editorStateSelector = (state: RootState) => ({
  editorConfig: state.editorConfig,
  isViewing: state.isViewing,
  isEditing: state.isEditing,
  addingWidget: state.addingWidget,
  isLoadingModel: state.isLoadingModel,
  transformControls: state.transformControls,
  transformControlMode: state.transformControlMode,
  cameraCommand: state.cameraCommand,
  cameraControlsType: state.cameraControlsType,
  selectedSceneNodeRef: state.selectedSceneNodeRef,
  selectedSceneSubmodelRef: state.selectedSceneSubmodelRef,
  cursorPosition: state.cursorPosition,
  cursorLookAt: state.cursorLookAt,
  cursorVisible: state.cursorVisible,
  cursorStyle: state.cursorStyle,

  setEditorConfig: state.setEditorConfig,
  getObject3DBySceneNodeRef: state.getObject3DBySceneNodeRef,
  setSelectedSceneNodeRef: state.setSelectedSceneNodeRef,
  setSelectedSceneSubmodelRef: state.setSelectedSceneSubmodelRef,
  setTransformControls: state.setTransformControls,
  setTransformControlMode: state.setTransformControlMode,
  setCameraTarget: state.setCameraTarget,
  setCameraControlsType: state.setCameraControlsType,
  setSceneNodeObject3DMapping: state.setSceneNodeObject3DMapping,
  setAddingWidget: state.setAddingWidget,
  setCursorPosition: state.setCursorPosition,
  setCursorLookAt: state.setCursorLookAt,
  setCursorVisible: state.setCursorVisible,
  setCursorStyle: state.setCursorStyle,
  activeCameraSettings: state.activeCameraSettings,
  setActiveCameraSettings: state.setActiveCameraSettings,
  activeCameraName: state.activeCameraName,
  setActiveCameraName: state.setActiveCameraName,
  mainCameraObject: state.mainCameraObject,
  setMainCameraObject: state.setMainCameraObject,
});

const dataStoreSelector = (state: RootState): IDataStoreSlice => ({
  dataBindingTemplate: state.dataBindingTemplate,
  dataInput: state.dataInput,
  setDataInput: state.setDataInput,
  setDataBindingTemplate: state.setDataBindingTemplate,
});

const nodeErrorStateSelector = (state: RootState): INodeErrorStateSlice => ({
  nodeErrorMap: state.nodeErrorMap,
  addNodeError: state.addNodeError,
  removeNodeError: state.removeNodeError,
});

const viewOptionStateSelector = (state: RootState): IViewOptionStateSlice => ({
  viewport: state.noHistoryStates.viewport,
  setViewport: state.noHistoryStates.setViewport,
  dataBindingQueryRefreshRate: state.noHistoryStates.dataBindingQueryRefreshRate,
  setDataBindingQueryRefreshRate: state.noHistoryStates.setDataBindingQueryRefreshRate,
  autoQueryEnabled: state.noHistoryStates.autoQueryEnabled,
  setAutoQueryEnabled: state.noHistoryStates.setAutoQueryEnabled,
  componentVisibilities: state.noHistoryStates.componentVisibilities,
  toggleComponentVisibility: state.noHistoryStates.toggleComponentVisibility,
  tagSettings: state.noHistoryStates.tagSettings,
  setTagSettings: state.noHistoryStates.setTagSettings,
  connectionNameForMatterportViewer: state.noHistoryStates.connectionNameForMatterportViewer,
  setConnectionNameForMatterportViewer: state.noHistoryStates.setConnectionNameForMatterportViewer,
});

/**
 * useSceneDocument is a useful short-hand hook for reacting to scene document changes.
 * NOTE: this will cause refresh whenever there is a change in the whole document.
 * You should use a smaller granular state if that's not your intention.
 */
const useSceneDocument = (id: string) => {
  return accessStore(id)(sceneDocumentSelector, shallow);
};

const useEditorState = (id: string) => {
  return accessStore(id)(editorStateSelector, shallow);
};

const useDataStore = (id: string): IDataStoreSlice => {
  return accessStore(id)(dataStoreSelector, shallow);
};

const useNodeErrorState = (id: string): INodeErrorStateSlice => {
  return accessStore(id)(nodeErrorStateSelector, shallow);
};

const useViewOptionState = (id: string): IViewOptionStateSlice => {
  return accessStore(id)(viewOptionStateSelector, shallow);
};

const isDocumentStateChanged = (current: ISceneDocumentInternal, previous: ISceneDocumentInternal): boolean => {
  // TODO: we'll just implement a simple comparision version for beta release
  return !shallow(current, previous);
};

export {
  accessStore,
  dataStoreSelector,
  editorStateSelector,
  isDocumentStateChanged,
  isISceneComponentInternal,
  isISceneNodeInternal,
  nodeErrorStateSelector,
  sceneDocumentSelector,
  useDataStore,
  useEditorState,
  useNodeErrorState,
  useSceneDocument,
  useViewOptionState,
  viewOptionStateSelector,
};
