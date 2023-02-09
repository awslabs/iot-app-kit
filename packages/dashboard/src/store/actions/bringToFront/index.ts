import { PayloadAction } from '@reduxjs/toolkit';

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
  const slectedWidgets = state.selectedWidgets;
  const selectedWidgetsIds = slectedWidgets.map(({ id }) => id);
  const topZIndex = maxBy(widgets, 'z')?.z ?? 0;
  const minSelectedZ = minBy(slectedWidgets, 'z')?.z ?? 0;

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
