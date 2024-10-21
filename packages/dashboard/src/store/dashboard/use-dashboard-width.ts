import { useCallback } from 'react';
import { useStoreDispatch, useStoreSelector } from '../hooks';
import { updateHeight } from './reducer';
import { selectDashboardWidth } from './selectors';

export function useDashboardWidth() {
  const dispatch = useStoreDispatch();
  const width = useStoreSelector(selectDashboardWidth);
  const setWidth = useCallback(
    (payload: typeof width) => {
      dispatch(updateHeight(payload));
    },
    [dispatch]
  );

  return [width, setWidth] as const;
}
