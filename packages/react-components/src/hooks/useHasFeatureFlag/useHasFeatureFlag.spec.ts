import { renderHook } from '@testing-library/react';
import { useHasFeatureFlag } from './useHasFeatureFlag';

it('returns a boolean value representing the ', () => {
  const {
    result: { current: hasFlag },
  } = renderHook(() => useHasFeatureFlag('ENABLE_E_CHARTS'));

  expect(hasFlag).toEqual(false);
});
