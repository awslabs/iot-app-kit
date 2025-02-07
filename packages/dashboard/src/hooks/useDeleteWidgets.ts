import { useDispatch } from 'react-redux';
import { onDeleteWidgetsAction } from '~/store/actions';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { useCallback } from 'react';

export const useDeleteWidgets = () => {
  const dispatch = useDispatch();

  return useCallback(
    (widgetIds: readonly WidgetInstance['id'][]) =>
      dispatch(onDeleteWidgetsAction({ widgetIds })),
    [dispatch]
  );
};
