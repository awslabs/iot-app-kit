import type { PayloadAction } from '@reduxjs/toolkit';
import maxBy from 'lodash-es/maxBy';
import minBy from 'lodash-es/minBy';
import xorBy from 'lodash-es/xorBy';
import type { DashboardState } from '../../state';
import { getWidgets } from '~/hooks/useSelectedWidget';

export interface BringWidgetsToFrontAction extends PayloadAction<null> {
  type: 'BRING_WIDGETS_TO_FRONT';
}

export const onBringWidgetsToFrontAction = (): BringWidgetsToFrontAction => ({
  type: 'BRING_WIDGETS_TO_FRONT',
  payload: null,
});

export const bringWidgetsToFront = (state: DashboardState): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgetIds = state.selectedWidgetIds;
  const selectedWidgets = getWidgets(
    selectedWidgetIds,
    state.dashboardConfiguration.widgets
  );
  const unselectedWidgets = xorBy(widgets, selectedWidgets, 'id');

  // We don't need to do anything if all widgets are selected
  if (unselectedWidgets.length === 0) {
    return state;
  }

  const topZIndex = maxBy(unselectedWidgets, 'z')?.z ?? 0;
  const minSelectedZ = minBy(selectedWidgets, 'z')?.z ?? 0;

  const zOffset = topZIndex + 1 - minSelectedZ;

  const translatedWidgets = widgets.map((widget) => ({
    ...widget,
    z: selectedWidgetIds.includes(widget.id) ? widget.z + zOffset : widget.z,
  }));

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: translatedWidgets,
    },
    selectedWidgetIds,
  };
};
