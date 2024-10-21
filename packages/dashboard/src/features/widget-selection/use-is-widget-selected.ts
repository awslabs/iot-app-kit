import includes from 'lodash/includes';
import map from 'lodash/map';
import { useCallback } from 'react';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import type { DashboardWidget } from '~/types';

/**
 * Helper hook that can be exposed to consumers making their own widget components
 *
 * used to determine if this widget is in the selection
 *
 */
export const useIsWidgetSelected = <T extends DashboardWidget>(widget: T) => {
  const selectedWidgetIds = useSelectedWidgetIds();

  const isSelected = useCallback(
    () =>
      includes(
        map(selectedWidgetIds, (id) => id),
        widget.id
      ),
    [selectedWidgetIds, widget]
  );

  return isSelected();
};
