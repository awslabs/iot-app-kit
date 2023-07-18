import { useContext } from 'react';
import { FEATURE_FLAGS } from '../../components/iot-app-kit-config/types';
import { AppKitContext } from '../../components/iot-app-kit-config';
import { DEFAULT_APP_KIT_CONFIG } from '../../components/iot-app-kit-config/defaultValues';

export const useHasFeatureFlag = (flagName: string): boolean => {
  const config = useContext(AppKitContext) ?? DEFAULT_APP_KIT_CONFIG;

  if (flagName in FEATURE_FLAGS) {
    const key = FEATURE_FLAGS[flagName as keyof typeof FEATURE_FLAGS];
    return !!config.featureFlagConfig[key];
  }

  return false;
};
