// wrapper that will initially only have a feature flag config
import React, { ReactNode, createContext } from 'react';
import { FeatureFlagConfig } from './types';
import { DEFAULT_APP_KIT_CONFIG } from './defaultValues';

export interface IAppKitConfig {
  featureFlagConfig: FeatureFlagConfig;
}

export const AppKitContext = createContext<IAppKitConfig>(
  DEFAULT_APP_KIT_CONFIG
);

export type AppKitConfigProps = {
  children: ReactNode;
  customFeatureConfig?: FeatureFlagConfig;
};

export const AppKitConfig: React.FC<AppKitConfigProps> = ({
  children,
  customFeatureConfig,
}) => {
  const value = {
    featureFlagConfig: {
      ...DEFAULT_APP_KIT_CONFIG.featureFlagConfig,
      ...customFeatureConfig,
    },
  };
  return (
    <AppKitContext.Provider value={value}>{children}</AppKitContext.Provider>
  );
};
