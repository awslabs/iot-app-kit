import { useCallback } from 'react';
import { useStoreDispatch, useStoreSelector } from '../hooks';
import { updateHeight } from './reducer';
import { selectDashboardHeight } from './selectors';

export function useDashboardHeight() {
  const dispatch = useStoreDispatch();
  const height = useStoreSelector(selectDashboardHeight);
  const setHeight = useCallback(
    (payload: typeof height) => {
      dispatch(updateHeight(payload));
    },
    [dispatch]
  );

  return [height, setHeight] as const;
}
