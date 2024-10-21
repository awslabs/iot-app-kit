import { useCallback } from 'react';
import { useStoreDispatch } from '../hooks';
import { createWidgets } from './reducer';

export function useCreateWidgets() {
  const dispatch = useStoreDispatch();

  const onCreateWidgets = useCallback(
    (payload: Parameters<typeof createWidgets>[0]) => {
      dispatch(createWidgets(payload));
    },
    [dispatch]
  );

  return onCreateWidgets;
}
