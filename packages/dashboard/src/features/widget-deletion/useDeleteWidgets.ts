import { useCallback } from 'react';
import { useSelectWidgets } from '~/features/widgetSelection/useSelectWidgets';
import { deleteWidgets } from '#dashboard-configuration/store';
import { useStoreDispatch } from '#store/hooks';

export type UseDeleteWidgetsResult = ReturnType<typeof useDeleteWidgets>;

export function useDeleteWidgets() {
  const { deselect } = useSelectWidgets();
  const dispatch = useStoreDispatch();

  const onDeleteWidgets = useCallback(
    (payload: Parameters<typeof deleteWidgets>[0]) => {
      dispatch(deleteWidgets(payload));
      deselect(payload);
    },
    [dispatch, deselect]
  );

  return onDeleteWidgets;
}
