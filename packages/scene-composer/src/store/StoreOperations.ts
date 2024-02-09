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
  | 'setConvertSceneModalVisibility'
  | 'setDeleteConfirmationModalVisible'
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
  | 'renderSceneNodesFromLayers'
  | 'updateSceneNodeInternal'
  | 'updateSceneNodeInternalTransient'
  | 'updateSceneNodeInternalBatch'
  | 'updateSceneNodeInternalBatchTransient'
  | 'updateDocumentInternal'
  | 'removeSceneNode'
  | 'updateSceneRuleMapById'
  | 'removeSceneRuleMapById'
  | 'addComponentInternal'
  | 'updateComponentInternal'
  | 'removeComponent'
  | 'setSceneProperty';

export type SceneComposerDataOperation = 'setDataInput' | 'setDataBindingTemplate';

export type SceneComposerViewOptionOperation =
  | 'setViewport'
  | 'setDataBindingQueryRefreshRate'
  | 'setAutoQueryEnabled'
  | 'toggleComponentVisibility'
  | 'setTagSettings'
  | 'setConnectionNameForMatterportViewer';

export type SceneComposerOperation =
  | SceneComposerEditorOperation
  | SceneComposerDocumentOperation
  | SceneComposerViewOptionOperation
  | SceneComposerDataOperation;

export const SceneComposerOperationTypeMap: Record<SceneComposerOperation, OperationType> = {
  // loadScene is a speical operation as we want to clear the undo/redo state after this
  loadScene: 'INITIALIZE',

  appendSceneNodeInternal: 'UPDATE_DOCUMENT',
  renderSceneNodesFromLayers: 'UPDATE_DOCUMENT',
  updateSceneNodeInternal: 'UPDATE_DOCUMENT',
  updateSceneNodeInternalTransient: 'TRANSIENT',
  updateSceneNodeInternalBatch: 'UPDATE_DOCUMENT',
  updateSceneNodeInternalBatchTransient: 'TRANSIENT',
  updateDocumentInternal: 'UPDATE_DOCUMENT',
  removeSceneNode: 'UPDATE_DOCUMENT',
  addComponentInternal: 'UPDATE_DOCUMENT',
  updateComponentInternal: 'UPDATE_DOCUMENT',
  removeComponent: 'UPDATE_DOCUMENT',
  updateSceneRuleMapById: 'UPDATE_DOCUMENT',
  removeSceneRuleMapById: 'UPDATE_DOCUMENT',
  setSceneProperty: 'UPDATE_DOCUMENT',

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
  setConvertSceneModalVisibility: 'UPDATE_EDITOR',
  setDeleteConfirmationModalVisible: 'UPDATE_EDITOR',
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

  setViewport: 'TRANSIENT',
  setDataBindingQueryRefreshRate: 'TRANSIENT',
  setAutoQueryEnabled: 'TRANSIENT',
  toggleComponentVisibility: 'TRANSIENT',
  setTagSettings: 'TRANSIENT',
  setConnectionNameForMatterportViewer: 'TRANSIENT',
};
