export enum FEATURE_FLAGS {
  ENABLE_E_CHARTS = 'ENABLE_E_CHARTS',
}

export type FeatureFlagConfig = Partial<Record<FEATURE_FLAGS, boolean>>;
