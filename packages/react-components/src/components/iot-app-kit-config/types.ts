export enum FEATURE_FLAGS {
  ENABLE_E_CHARTS = 'ENABLE_E_CHARTS',
  ENABLE_SYMBOL_LIBRARY = 'ENABLE_SYMBOL_LIBRARY',
}

export type FeatureFlagConfig = Partial<Record<FEATURE_FLAGS, boolean>>;
