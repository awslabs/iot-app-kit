import { renderHook } from '@testing-library/react';

import { setFeatureConfig } from '../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../interfaces';

import useDynamicScene from './useDynamicScene';

describe('useDynamicScene', () => {
  [true, false].forEach((state) => {
    it(`should render correctly when state is ${state}`, () => {
      setFeatureConfig({
        [COMPOSER_FEATURES[COMPOSER_FEATURES.DynamicScene]]: state,
      });

      const { result } = renderHook(() => useDynamicScene());

      expect(result.current).toEqual(state);
    });
  });
});
