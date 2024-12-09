import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import { useCallback } from 'react';
import { useSelectedWidgets } from '../../hooks/useSelectedWidgets';
import type { DashboardWidget } from '../../types';

/**
 * Helper hook that can be exposed to consumers making their own widget components
 *
 * used to determine if this widget is in the selection
 *
 */
export const useIsSelected = <T extends DashboardWidget>(widget: T) => {
  const selectedWidgets = useSelectedWidgets();

  const isSelected = useCallback(
    () =>
      includes(
        map(selectedWidgets, (sw) => sw.id),
        widget.id
      ),
    [selectedWidgets, widget]
  );

  return isSelected();
};
