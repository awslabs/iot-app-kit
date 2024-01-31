export enum COMPOSER_FEATURES {
  FOR_TESTS = 'FOR_TESTS', // Feature flags may come and go, as things launch, this one is used for automated testing, so please don't remove it.
  SceneHierarchyMultiSelect = 'SceneHierarchyMultiSelect',
  Matterport = 'Matterport',
  SubModelMovement = 'SubModelMovement',
  SubModelChildren = 'SubModelChildren',
  Animations = 'Animations',
  DynamicScene = 'DynamicScene',
  DynamicSceneAlpha = 'DynamicSceneAlpha', // gate changes pending backend prod deployment and integrated testing
  FirstPerson = 'FirstPerson',
  SceneAppearance = 'SceneAppearance',
  Textures = 'Textures',
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
