export enum COMPOSER_FEATURES {
  FOR_TESTS = 'FOR_TESTS', // Feature flags may come and go, as things launch, this one is used for automated testing, so please don't remove it.
  i18n = 'i18n',
  SceneHierarchySearch = 'SceneHierarchySearch',
  SceneHierarchyReorder = 'SceneHierarchyReorder',
  SceneHierarchyMultiSelect = 'SceneHierarchyMultiSelect',
  SubModelSelection = 'SubModelSelection',
  OpacityRule = 'OpacityRule',
  ENHANCED_EDITING = 'ENHANCED_EDITING',
  CameraView = 'CameraView',
  Matterport = 'Matterport',
  TagResize = 'TagResize',
  SubModelMovement = 'SubModelMovement',
  SubModelChildren = 'SubModelChildren',
  Overlay = 'Overlay',

  // Deprecated features (to be removed)
  EnvironmentModel = 'EnvironmentModel',
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
