import { useEffect, useState } from 'react';

import { getGlobalSettings, subscribe, unsubscribe } from '../GlobalSettings';
import { COMPOSER_FEATURES } from '../interfaces';
import useLogger from '../logger/react-logger/hooks/useLogger';

const useFeature = (feature: string) => {
  const log = useLogger(feature);
  const [featureConfig, setFeatureConfig] = useState(getGlobalSettings().featureConfig);
  const [featureState, setFeatureState] = useState('C');

  useEffect(() => {
    const onUpdated = () => {
      const newState = getGlobalSettings().featureConfig[feature];
      setFeatureConfig(newState);
    };

    subscribe(onUpdated);

    return () => unsubscribe(onUpdated);
  }, [setFeatureConfig]);

  useEffect(() => {
    log?.verbose('', featureConfig, COMPOSER_FEATURES[feature]);
    try {
      setFeatureState(featureConfig[COMPOSER_FEATURES[feature]] ? 'T1' : 'C'); // comment
    } catch (e) {
      log?.fatal(`Failed to evaluate feature status "${feature}" `, e);
      setFeatureState('C');
    }
  }, [featureConfig]);

  return [{ variation: featureState }]; // Keep structure of feature toggle system for compatibility.
};

export default useFeature;
