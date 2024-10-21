import { useCallback } from 'react';
import { useStoreDispatch, useStoreSelector } from '../hooks';
import { updateRefreshRate } from './reducer';
import { selectDashboardRefreshRate } from './selectors';

export function useDashboardRefreshRate() {
  const dispatch = useStoreDispatch();
  const refreshRate = useStoreSelector(selectDashboardRefreshRate);
  const setRefreshRate = useCallback(
    (payload: typeof refreshRate) => {
      dispatch(updateRefreshRate(payload));
    },
    [dispatch]
  );

  return [refreshRate, setRefreshRate] as const;
}
