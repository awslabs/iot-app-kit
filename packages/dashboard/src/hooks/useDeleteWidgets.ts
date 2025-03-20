import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onDeleteWidgetsAction } from '~/store/actions';

export const useDeleteWidgets = () => {
  const dispatch = useDispatch();

  return useCallback(
    (widgetIds: readonly string[]) => {
      dispatch(onDeleteWidgetsAction({ widgetIds }));
    },
    [dispatch]
  );
};
