import { useCallback } from 'react';
import { deleteWidgets } from '../../store/dashboard/reducer';
import { useStoreDispatch } from '../../store/hooks';

export type UseDeleteWidgetsResult = ReturnType<typeof useDeleteWidgets>;

export function useDeleteWidgets() {
  const dispatch = useStoreDispatch();

  const onDeleteWidgets = useCallback(
    (payload: Parameters<typeof deleteWidgets>[0]) =>
      dispatch(deleteWidgets(payload)),
    [dispatch]
  );

  return onDeleteWidgets;
}
