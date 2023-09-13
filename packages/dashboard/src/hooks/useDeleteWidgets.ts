import { useDispatch } from 'react-redux';
import { DashboardWidget } from '..';
import { onDeleteWidgetsAction } from '~/store/actions';

export const useDeleteWidgets = () => {
  const dispatch = useDispatch();
  const onDelete = (toDelete: DashboardWidget | DashboardWidget[]) => {
    dispatch(
      onDeleteWidgetsAction({
        widgets: Array.isArray(toDelete) ? toDelete : [toDelete],
      })
    );
  };

  return {
    onDelete,
  };
};
