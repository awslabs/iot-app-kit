import { useCallback } from 'react';
import { useStoreDispatch } from '~/store';
import { selectAdditionalWidgets, selectWidgets } from './selection-store';

export function useSelectWidgets() {
  const dispatch = useStoreDispatch();

  const handleSelect = useCallback(
    (payload: Parameters<typeof selectWidgets>[0]) => {
      dispatch(selectWidgets(payload));
    },
    [dispatch]
  );

  const handleSelectAdditional = useCallback(
    (payload: Parameters<typeof selectAdditionalWidgets>[0]) => {
      dispatch(selectAdditionalWidgets(payload));
    },
    [dispatch]
  );

  const handleDeselect = useCallback(() => {
    dispatch(selectWidgets({ widgetIds: [] }));
  }, [dispatch]);

  return {
    select: handleSelect,
    selectAdditional: handleSelectAdditional,
    deselect: handleDeselect,
  };
}
