import { useSelector } from 'react-redux';
import includes from 'lodash/includes';
import map from 'lodash/map';

import { DashboardState } from '~/store/state';
import { Widget } from '~/types';
import { useCallback } from 'react';

/**
 * Helper hook that can be exposed to consumers making their own widget components
 *
 * used to determine if this widget is in the selection
 *
 */
export const useIsSelected = <T extends Widget>(widget: T) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);

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
