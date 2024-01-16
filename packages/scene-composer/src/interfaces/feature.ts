export enum COMPOSER_FEATURES {
  FOR_TESTS = 'FOR_TESTS', // Feature flags may come and go, as things launch, this one is used for automated testing, so please don't remove it.
  SceneHierarchyMultiSelect = 'SceneHierarchyMultiSelect',
  OpacityRule = 'OpacityRule',
  CameraView = 'CameraView',
  Matterport = 'Matterport',
  TagResize = 'TagResize',
  SubModelMovement = 'SubModelMovement',
  SubModelChildren = 'SubModelChildren',
  Overlay = 'Overlay',
  DataBinding = 'DataBinding',
  TagStyle = 'TagStyle',
  AutoQuery = 'AutoQuery',
  Animations = 'Animations',
  DynamicScene = 'DynamicScene',
  FirstPerson = 'FirstPerson',
  SceneAppearance = 'SceneAppearance',
  Textures = 'Textures',

  // Deprecated features (to be removed)
  EnvironmentModel = 'EnvironmentModel',
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
