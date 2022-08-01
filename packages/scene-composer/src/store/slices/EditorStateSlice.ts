import * as THREE from 'three';
import { GetState, SetState, StoreApi } from 'zustand';

import { TransformControls } from '../../three/TransformControls';
import {
  CameraControlMode,
  CameraControlsType,
  TransformControlMode,
  CameraTarget,
  AddingWidgetInfo,
} from '../../interfaces';
import { RootState } from '../Store';
import { CursorStyle, IDisplayMessage, IEditorConfig } from '../internalInterfaces';

// The MappingWrapper is used to bypass immer's snapshotting/copy-on-write mechanism
// Immer will make plain objects immutable which makes it impossible to update without
// create a new copy of the instance. We don't want this behavior for the NodeRef to
// Object3D mapping as it will cause a high perf penalty.
// Wrapping the hashmap inside a ES6 class will cause immer skipping the object.
// This also means that any updates to this object will not cause refresh to the state
// store and cannot be subscribed to. It's fine to use this mechanism on this mapping
// object as we never expect the mapping to be changed and no app logic should be
// dependent on the update of the mapping status.
// WARN: This mechanism can cause confusion and should be used with caution.
class MappingWrapper {
  private mapping: Record<string, THREE.Object3D>;

  constructor() {
    this.mapping = {};
  }

  getMapping(): Record<string, THREE.Object3D> {
    return this.mapping;
  }
}

export interface IEditorStateSlice {
  /* Editor Config */
  editorConfig: IEditorConfig;

  setEditorConfig(config: IEditorConfig, replace?: boolean): void;
  getEditorConfig(): IEditorConfig;

  isViewing(): boolean;
  isEditing(): boolean;
  isInViewpointTransition: boolean;
  setInViewpointTransition(isIntransition: boolean): void;

  addingWidget: AddingWidgetInfo | undefined;
  setAddingWidget(addingWidget?: AddingWidgetInfo);

  /* Editor State */
  // Editor UI
  isLoadingModel: boolean;
  messages: IDisplayMessage[];
  setLoadingModelState(isLoading: boolean): void;
  addMessages(messages: IDisplayMessage[]): void;
  clearMessages(): void;
  getMessages(): IDisplayMessage[];

  // Selection and highlights
  selectedSceneNodeRef?: string;
  highlightedSceneNodeRef?: string;

  setSelectedSceneNodeRef(nodeRef?: string): void;
  setHighlighedSceneNodeRef(nodeRef?: string): void;

  // Controls states
  transformControls?: TransformControls;
  transformControlMode: TransformControlMode;
  cameraControlsType: CameraControlsType;

  setTransformControls(controls: TransformControls): void;
  setTransformControlMode(mode: TransformControlMode): void;
  setCameraControlsType(type: CameraControlsType): void;

  // Camera command
  cameraCommand?: { target: CameraTarget; mode: CameraControlMode };
  setCameraTarget(target: CameraTarget, mode: CameraControlMode): void;

  // Reset
  resetEditorState(): void;

  /* Transite state that tracks Object3D mappings */
  sceneNodeRefObject3DMapping: MappingWrapper;
  setSceneNodeObject3DMapping(ref: string, object3d: THREE.Object3D): void;
  getObject3DBySceneNodeRef(ref: string | undefined): THREE.Object3D | undefined;

  // Viewpoints and Immersive View
  selectedViewpointNodeRef?: string;

  setSelectedViewpointNodeRef(ref?: string): void;

  // Global Cursor data
  cursorPosition: THREE.Vector3;
  setCursorPosition(position: THREE.Vector3): void;
  cursorLookAt: THREE.Vector3;
  setCursorLookAt(lookAt: THREE.Vector3): void;
  cursorVisible: boolean;
  setCursorVisible(isVisible: boolean): void;
  cursorStyle: CursorStyle;
  setCursorStyle(style: CursorStyle): void;
}

function createDefaultEditorState() {
  return {
    isLoadingModel: false,
    isInViewpointTransition: false,
    isAddingWidget: false,
    messages: [],
    selectedSceneNodeRef: undefined,
    highlightedSceneNodeRef: undefined,
    transformControls: undefined,
    transformControlMode: 'translate',
    cameraCommand: undefined,
    cameraControlsType: 'orbit',
    sceneNodeRefObject3DMapping: new MappingWrapper(),
    addingWidget: undefined,
    cursorPosition: new THREE.Vector3(0, 0, 0),
    cursorLookAt: new THREE.Vector3(0, 0, 0),
    cursorVisible: false,
    cursorStyle: 'move',
  };
}

export const createEditStateSlice = (set: SetState<RootState>, get: GetState<RootState>, api: StoreApi<RootState>) =>
  ({
    ...createDefaultEditorState(),

    editorConfig: {
      operationMode: undefined,
      uriModifier: undefined,
      valueDataBindingProvider: undefined,
      showAssetBrowserCallback: undefined,
      onAnchorClick: undefined,
      onWidgetClick: undefined,
      onSelectionChanged: undefined,
    },

    getEditorConfig() {
      return get().editorConfig;
    },

    setEditorConfig(config, replace?) {
      set((draft) => {
        if (replace) {
          draft.editorConfig = config;
        } else {
          draft.editorConfig = Object.assign({}, draft.editorConfig, config);
        }
        draft.lastOperation = 'setEditorConfig';
      });
    },

    isViewing() {
      return get().editorConfig.operationMode === 'Viewing';
    },

    isEditing() {
      return get().editorConfig.operationMode === 'Editing';
    },

    setAddingWidget(addingWidget?: AddingWidgetInfo) {
      set((draft) => {
        draft.addingWidget = addingWidget;
        draft.lastOperation = 'setAddingWidget';
      });
    },

    setLoadingModelState(isLoading) {
      set((draft) => {
        draft.isLoadingModel = isLoading;
        draft.lastOperation = 'setLoadingModelState';
      });
    },

    setInViewpointTransition(isIntransition: boolean) {
      set((draft) => {
        draft.isInViewpointTransition = isIntransition;
        draft.lastOperation = 'setViewpointTransition';
      });
    },

    addMessages(messages) {
      set((draft) => {
        draft.messages.push(...messages);
        draft.lastOperation = 'addMessages';
      });
    },

    clearMessages() {
      set((draft) => {
        if (draft.messages.length > 0) {
          draft.messages.splice(0, draft.messages.length);
        }
        draft.lastOperation = 'clearMessages';
      });
    },

    getMessages() {
      return get().messages;
    },

    setSelectedSceneNodeRef(nodeRef?: string) {
      set((draft) => {
        draft.selectedSceneNodeRef = nodeRef;
        draft.lastOperation = 'setSelectedSceneNodeRef';
      });
    },

    setHighlighedSceneNodeRef(nodeRef?: string) {
      set((draft) => {
        draft.highlightedSceneNodeRef = nodeRef;
        draft.lastOperation = 'setHighlighedSceneNodeRef';
      });
    },

    setTransformControlMode(mode) {
      set((draft) => {
        draft.transformControlMode = mode;
        draft.lastOperation = 'setTransformControlMode';
      });
    },

    setTransformControls(transformControls) {
      set((draft) => {
        draft.transformControls = transformControls;
        draft.lastOperation = 'setTransformControls';
      });
    },

    setCameraControlsType(type) {
      set((draft) => {
        draft.cameraControlsType = type;
        draft.lastOperation = 'setCameraControlsType';
      });
    },

    setCameraTarget(target, mode) {
      set((draft) => {
        draft.cameraCommand = { target, mode };
        draft.lastOperation = 'setCameraTarget';
      });
    },

    resetEditorState() {
      set((draft) => {
        Object.assign(draft, createDefaultEditorState());
        draft.lastOperation = 'resetEditorState';
      });
    },

    setSceneNodeObject3DMapping(ref, object3d) {
      // don't use set() as we don't want to trigger a state update.
      get().sceneNodeRefObject3DMapping.getMapping()[ref] = object3d;
      // we don't update the store's lastOperation as this is a transient option and can be called
      // very frequently during scene loading.
    },

    getObject3DBySceneNodeRef(ref) {
      if (ref === undefined) return undefined;

      return get().sceneNodeRefObject3DMapping.getMapping()[ref];
    },

    setSelectedViewpointNodeRef(nodeRef?: string) {
      set((draft) => {
        draft.selectedViewpointNodeRef = nodeRef;
        draft.lastOperation = 'setSelectedViewpointNodeRef';
      });
    },

    setCursorPosition(position: THREE.Vector3) {
      set((draft) => {
        draft.cursorPosition = position;
        draft.lastOperation = 'setCursorPosition';
      });
    },

    setCursorLookAt(lookAt: THREE.Vector3) {
      set((draft) => {
        draft.cursorLookAt = lookAt;
        draft.lastOperation = 'setCursorLookAt';
      });
    },

    setCursorVisible(isVisible: boolean) {
      set((draft) => {
        draft.cursorVisible = isVisible;
        draft.lastOperation = 'setCursorVisible';
      });
    },

    setCursorStyle(style: CursorStyle) {
      set((draft) => {
        draft.cursorStyle = style;
        draft.lastOperation = 'setCursorStyle';
      });
    },
  } as IEditorStateSlice);

export const exportsForTesting = {
  MappingWrapper,
};
