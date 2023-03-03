import create, { StateCreator, UseStore } from 'zustand';
import shallow from 'zustand/shallow';

import { log, immer, undoMiddleware, UndoState } from './middlewares';
import { SceneComposerOperation } from './StoreOperations';
import { createSceneDocumentSlice, ISceneDocumentSlice } from './slices/SceneDocumentSlice';
import { createEditStateSlice, IEditorStateSlice } from './slices/EditorStateSlice';
import { IDataStoreSlice, createDataStoreSlice } from './slices/DataStoreSlice';
import { createNodeErrorStateSlice, INodeErrorStateSlice } from './slices/NodeErrorStateSlice';
import { createViewOptionStateSlice, IViewOptionStateSlice } from './slices/ViewOptionStateSlice';
import {
  ISceneDocumentInternal,
  ISceneNodeInternal,
  ISceneComponentInternal,
  IModelRefComponentInternal,
  ISubModelRefComponentInternal,
  ICameraComponentInternal,
  IAnchorComponentInternal,
  ILightComponentInternal,
  IColorOverlayComponentInternal,
  isISceneComponentInternal,
  isISceneNodeInternal,
  IMotionIndicatorComponentInternal,
} from './internalInterfaces';

export type {
  // Document
  ISceneDocumentInternal,
  ISceneNodeInternal,
  ISceneComponentInternal,
  // Components
  IModelRefComponentInternal,
  ISubModelRefComponentInternal,
  ICameraComponentInternal,
  IAnchorComponentInternal,
  ILightComponentInternal,
  IColorOverlayComponentInternal,
  IMotionIndicatorComponentInternal,
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
const stateCreator: StateCreator<RootState> = (set, get, api) => ({
  lastOperation: undefined,
  ...createSceneDocumentSlice(set, get, api),
  ...createEditStateSlice(set, get, api),
  ...createDataStoreSlice(set, get, api),
  noHistoryStates: {
    ...createViewOptionStateSlice(set, get, api),
  },
  ...createNodeErrorStateSlice(set, get, api),
});

const createStateImpl: () => UseStore<RootState> = () => create<RootState>(undoMiddleware(log(immer(stateCreator))));

// TODO: currently undoMiddleware will record editor state changes, such as select/deselect object.
// We may want to fine-tune the undo/redo experience.
const stores = new Map<string, UseStore<RootState>>();

const useStore: (id: string) => UseStore<RootState> = (id: string) => {
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

const dataStoreSelector = (state: RootState) => ({
  dataBindingTemplate: state.dataBindingTemplate,
  dataInput: state.dataInput,
  setDataInput: state.setDataInput,
});

const nodeErrorStateSelector = (state: RootState) => ({
  nodeErrorMap: state.nodeErrorMap,
  addNodeError: state.addNodeError,
  removeNodeError: state.removeNodeError,
});

const viewOptionStateSelector = (state: RootState) => ({
  motionIndicatorVisible: state.noHistoryStates.motionIndicatorVisible,
  toggleMotionIndicatorVisibility: state.noHistoryStates.toggleMotionIndicatorVisibility,
  tagSettings: state.noHistoryStates.tagSettings,
  setTagSettings: state.noHistoryStates.setTagSettings,
});

/**
 * useSceneDocument is a useful short-hand hook for reacting to scene document changes.
 * NOTE: this will cause refresh whenever there is a change in the whole document.
 * You should use a smaller granular state if that's not your intention.
 */
const useSceneDocument = (id: string) => {
  return useStore(id)(sceneDocumentSelector, shallow);
};

const useEditorState = (id: string) => {
  return useStore(id)(editorStateSelector, shallow);
};

const useDataStore = (id: string) => {
  return useStore(id)(dataStoreSelector, shallow);
};

const useNodeErrorState = (id: string) => {
  return useStore(id)(nodeErrorStateSelector, shallow);
};

const useViewOptionState = (id: string) => {
  return useStore(id)(viewOptionStateSelector, shallow);
};

const isDocumentStateChanged = (current: ISceneDocumentInternal, previous: ISceneDocumentInternal): boolean => {
  // TODO: we'll just implement a simple comparision version for beta release
  return !shallow(current, previous);
};

export {
  useStore,
  sceneDocumentSelector,
  editorStateSelector,
  useSceneDocument,
  useEditorState,
  dataStoreSelector,
  useDataStore,
  nodeErrorStateSelector,
  useNodeErrorState,
  isDocumentStateChanged,
  isISceneComponentInternal,
  isISceneNodeInternal,
  viewOptionStateSelector,
  useViewOptionState,
};
