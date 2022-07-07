export enum COMPOSER_FEATURES {
  IMMERSIVE_VIEW,
  MOTION_INDICATOR,
  CUSTOM_VIEWPOINTS,
  i18n,
  SceneHierarchyRedesign,
  SceneHierarchySearch,
  SceneHierarchyReorder,
  SceneHierarchyMultiSelect,
  ENHANCED_EDITING,
}

export type FeatureConfig = Partial<Record<COMPOSER_FEATURES, boolean>>;
