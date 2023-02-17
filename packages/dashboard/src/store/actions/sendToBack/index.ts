import { PayloadAction } from '@reduxjs/toolkit';

import xorBy from 'lodash/xorBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';

import { DashboardState } from '../../state';

export interface SendWidgetsToBackAction extends PayloadAction<null> {
  type: 'SEND_WIDGETS_TO_BACK';
}

export const onSendWidgetsToBackAction = (): SendWidgetsToBackAction => ({
  type: 'SEND_WIDGETS_TO_BACK',
  payload: null,
});

export const sendWidgetsToBack = (state: DashboardState): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgets = state.selectedWidgets;

  const unselectedWidgets = xorBy(widgets, selectedWidgets, 'id');

  // We don't need to do anything if all widgets are selected
  if (unselectedWidgets.length === 0) {
    return state;
  }

  const selectedWidgetsIds = selectedWidgets.map(({ id }) => id);
  const bottomZIndex = minBy(unselectedWidgets, 'z')?.z ?? 0;
  const maxSelectedZ = maxBy(selectedWidgets, 'z')?.z ?? 0;

  const zOffset = bottomZIndex - 1 - maxSelectedZ;

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
