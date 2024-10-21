import { useCallback } from 'react';
import { useStoreDispatch } from '../hooks';
import { updateWidgets } from './reducer';

export function useUpdateWidgets() {
  const dispatch = useStoreDispatch();

  return useCallback(
    (payload: Parameters<typeof updateWidgets>[0]) => {
      dispatch(updateWidgets(payload));
    },
    [dispatch]
  );
}
