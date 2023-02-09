import { PayloadAction } from '@reduxjs/toolkit';

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
  const slectedWidgets = state.selectedWidgets;
  const selectedWidgetsIds = slectedWidgets.map(({ id }) => id);
  const bottomZIndex = minBy(widgets, 'z')?.z ?? 0;
  const maxSelectedZ = maxBy(slectedWidgets, 'z')?.z ?? 0;

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
