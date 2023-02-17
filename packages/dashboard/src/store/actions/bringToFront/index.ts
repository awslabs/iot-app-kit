import { PayloadAction } from '@reduxjs/toolkit';

import xorBy from 'lodash/xorBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';

import { DashboardState } from '../../state';

export interface BringWidgetsToFrontAction extends PayloadAction<null> {
  type: 'BRING_WIDGETS_TO_FRONT';
}

export const onBringWidgetsToFrontAction = (): BringWidgetsToFrontAction => ({
  type: 'BRING_WIDGETS_TO_FRONT',
  payload: null,
});

export const bringWidgetsToFront = (state: DashboardState): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgets = state.selectedWidgets;

  const unselectedWidgets = xorBy(widgets, selectedWidgets, 'id');

  // We don't need to do anything if all widgets are selected
  if (unselectedWidgets.length === 0) {
    return state;
  }

  const selectedWidgetsIds = selectedWidgets.map(({ id }) => id);
  const topZIndex = maxBy(unselectedWidgets, 'z')?.z ?? 0;
  const minSelectedZ = minBy(selectedWidgets, 'z')?.z ?? 0;

  const zOffset = topZIndex + 1 - minSelectedZ;

  const translatedWidgets = widgets.map((widget) => ({
    ...widget,
    z: selectedWidgetsIds.includes(widget.id) ? widget.z + zOffset : widget.z,
  }));

  const translatedSelectedWidgets = translatedWidgets.filter((widget) => selectedWidgetsIds.includes(widget.id));

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: translatedWidgets,
    },
    selectedWidgets: translatedSelectedWidgets,
  };
};
