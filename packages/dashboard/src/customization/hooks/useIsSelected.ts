import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import { useCallback } from 'react';
import { useSelectedWidgetIds } from '~/hooks/useSelectedWidget';
import type { DashboardWidget } from '~/types';

/**
 * Helper hook that can be exposed to consumers making their own widget components
 *
 * used to determine if this widget is in the selection
 *
 */
export const useIsSelected = <T extends DashboardWidget>(widget: T) => {
  const selectedWidgets = useSelectedWidgetIds();

  const isSelected = useCallback(
    () =>
      includes(
        map(selectedWidgets, (widgetId) => widgetId),
        widget.id
      ),
    [selectedWidgets, widget]
  );

  return isSelected();
};
