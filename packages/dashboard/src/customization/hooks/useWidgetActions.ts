import { useDispatch } from 'react-redux';

import { onUpdateWidgetsAction } from '~/store/actions';
import type { DashboardWidget } from '~/types';

/**
 * Helper hook that can be exposed to consumers making their own widget components
 *
 * used to update itself in the store
 *
 */
export const useWidgetActions = <T extends DashboardWidget>() => {
  const dispatch = useDispatch();

  const update = (widget: T) =>
    dispatch(
      onUpdateWidgetsAction({
        widgets: [widget],
      })
    );

  return {
    update,
  };
};
