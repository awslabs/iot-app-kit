import { useEffect, useState } from 'react';

import { getGlobalSettings, subscribe, unsubscribe } from '../common/GlobalSettings';

const useFeature = (feature: string) => {
  const state = getGlobalSettings().featureConfig[feature];
  const [featureState, setFeatureState] = useState(state);

  const onUpdated = () => {
    const newState = getGlobalSettings().featureConfig[feature];
    setFeatureState(newState);
  };

  useEffect(() => {
    subscribe(onUpdated);

    return () => unsubscribe(onUpdated);
  }, []);

  return [{ variation: featureState ? 'T1' : 'C' }];
};

export default useFeature;
