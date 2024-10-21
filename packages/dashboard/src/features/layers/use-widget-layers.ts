import { useCallback } from 'react';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import { useStoreDispatch } from '~/store';
import {
  bringWidgetsToFront,
  sendWidgetsToBack,
} from '~/store/dashboard/reducer';

export function useWidgetLayers() {
  const dispatch = useStoreDispatch();
  const selectedWidgetIds = useSelectedWidgetIds();

  const bringToFront = useCallback(() => {
    dispatch(bringWidgetsToFront({ widgetIds: selectedWidgetIds }));
  }, [dispatch, selectedWidgetIds]);

  const sendToBack = useCallback(() => {
    dispatch(sendWidgetsToBack({ widgetIds: selectedWidgetIds }));
  }, [dispatch, selectedWidgetIds]);

  return { bringToFront, sendToBack };
}
