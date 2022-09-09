export enum COMPOSER_FEATURES {
  FOR_TESTS, // Feature flags may come and go, as things launch, this one is used for automated testing, so please don't remove it.
  i18n,
  SceneHierarchyRedesign,
  SceneHierarchySearch,
  SceneHierarchyReorder,
  SceneHierarchyMultiSelect,
  SubModelSelection,
  OpacityRule,
  ENHANCED_EDITING,
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
