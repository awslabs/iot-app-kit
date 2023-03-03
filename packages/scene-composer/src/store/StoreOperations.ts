export type OperationType = 'INITIALIZE' | 'UPDATE_DOCUMENT' | 'UPDATE_EDITOR' | 'TRANSIENT';

export type SceneComposerEditorOperation =
  | 'resetEditorState'
  | 'setCameraControlsType'
  | 'setEditorConfig'
  | 'setSelectedSceneNodeRef'
  | 'setSubModelSelection'
  | 'setHighlightedSceneNodeRef'
  | 'setLoadingModelState'
  | 'setTransformControlMode'
  | 'setTransformControls'
  | 'setCameraTarget'
  | 'addMessages'
  | 'clearMessages'
  | 'setAddingWidget'
  | 'setCursorPosition'
  | 'setCursorLookAt'
  | 'setCursorVisible'
  | 'setCursorStyle'
  | 'setActiveCameraSettings'
  | 'setActiveCameraName'
  | 'setMainCameraObject';

export type SceneComposerDocumentOperation =
  | 'loadScene'
  | 'appendSceneNodeInternal'
  | 'updateSceneNodeInternal'
  | 'updateSceneNodeInternalTransient'
  | 'updateDocumentInternal'
  | 'removeSceneNode'
  | 'updateSceneRuleMapById'
  | 'removeSceneRuleMapById'
  | 'addComponentInternal'
  | 'updateComponentInternal'
  | 'removeComponent'
  | 'setSceneProperty'
  | 'clearTemplatizedDataBindings';

export type SceneComposerDataOperation = 'setDataInput' | 'setDataBindingTemplate';

export type SceneComposerViewOptionOperation = 'toggleMotionIndicatorVisibility' | 'setTagSettings';

export type SceneComposerOperation =
  | SceneComposerEditorOperation
  | SceneComposerDocumentOperation
  | SceneComposerViewOptionOperation
  | SceneComposerDataOperation;

export const SceneComposerOperationTypeMap: Record<SceneComposerOperation, OperationType> = {
  // loadScene is a speical operation as we want to clear the undo/redo state after this
  loadScene: 'INITIALIZE',

  appendSceneNodeInternal: 'UPDATE_DOCUMENT',
  updateSceneNodeInternal: 'UPDATE_DOCUMENT',
  updateSceneNodeInternalTransient: 'TRANSIENT',
  updateDocumentInternal: 'UPDATE_DOCUMENT',
  removeSceneNode: 'UPDATE_DOCUMENT',
  addComponentInternal: 'UPDATE_DOCUMENT',
  updateComponentInternal: 'UPDATE_DOCUMENT',
  removeComponent: 'UPDATE_DOCUMENT',
  updateSceneRuleMapById: 'UPDATE_DOCUMENT',
  removeSceneRuleMapById: 'UPDATE_DOCUMENT',
  setSceneProperty: 'UPDATE_DOCUMENT',
  clearTemplatizedDataBindings: 'UPDATE_DOCUMENT',

  resetEditorState: 'UPDATE_EDITOR',
  setCameraControlsType: 'UPDATE_EDITOR',
  setEditorConfig: 'UPDATE_EDITOR',
  setSelectedSceneNodeRef: 'UPDATE_EDITOR',
  setSubModelSelection: 'UPDATE_EDITOR',
  setHighlightedSceneNodeRef: 'UPDATE_EDITOR',
  setTransformControlMode: 'UPDATE_EDITOR',
  setTransformControls: 'UPDATE_EDITOR',
  setCameraTarget: 'UPDATE_EDITOR',
  addMessages: 'UPDATE_EDITOR',
  clearMessages: 'UPDATE_EDITOR',
  setAddingWidget: 'UPDATE_EDITOR',
  setCursorPosition: 'UPDATE_EDITOR',
  setCursorLookAt: 'UPDATE_EDITOR',
  setCursorVisible: 'UPDATE_EDITOR',
  setCursorStyle: 'UPDATE_EDITOR',
  setActiveCameraSettings: 'UPDATE_EDITOR',
  setActiveCameraName: 'UPDATE_EDITOR',
  setMainCameraObject: 'UPDATE_EDITOR',

  setLoadingModelState: 'TRANSIENT',
  setDataInput: 'TRANSIENT',
  setDataBindingTemplate: 'TRANSIENT',

  toggleMotionIndicatorVisibility: 'TRANSIENT',
  setTagSettings: 'TRANSIENT',
};
