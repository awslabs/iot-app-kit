export enum COMPOSER_FEATURES {
  MOTION_INDICATOR,
  i18n,
  SceneHierarchyRedesign,
  SceneHierarchySearch,
  SceneHierarchyReorder,
  SceneHierarchyMultiSelect,
  SubModelSelection,
  ENHANCED_EDITING,
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
