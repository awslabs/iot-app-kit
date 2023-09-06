import { COMPOSER_FEATURES } from '../interfaces';

import useFeature from './useFeature';

const useDynamicScene = () => {
  const enabled = useFeature(COMPOSER_FEATURES.DynamicScene).at(0)?.variation === 'T1';

  return !!enabled;
};

export default useDynamicScene;
