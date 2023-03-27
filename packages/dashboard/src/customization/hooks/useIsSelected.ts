import includes from 'lodash/includes';
import map from 'lodash/map';
import { useCallback } from 'react';
import type { DashboardWidget } from '~/types';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

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
