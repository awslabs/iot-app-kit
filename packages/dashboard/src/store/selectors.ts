import { isEqual } from 'lodash';
import { shallowEqual } from 'react-redux';
import { createSelectorCreator, weakMapMemoize } from 'reselect';
import type { RootState } from './store';

/**
 * Create a memoized selector referential and primitive quality comparision.
 */
export const createStoreSelector = createSelectorCreator({
  memoize: weakMapMemoize,
}).withTypes<RootState>();

/**
 * Create a memoized selector with shallow comparison.
 *
 * @remarks Be careful when using with frequently changing large data.
 */
export const createShallowStoreSelector = createSelectorCreator({
  memoize: weakMapMemoize,
  memoizeOptions: { resultEqualityCheck: shallowEqual },
}).withTypes<RootState>();

/**
 * Create a memoized selector with deep comparision
 *
 * @remarks Be careful when using with frequently changing large data.
 */
export const createDeepStoreSelector = createSelectorCreator({
  memoize: weakMapMemoize,
  memoizeOptions: { resultEqualityCheck: isEqual },
}).withTypes<RootState>();
