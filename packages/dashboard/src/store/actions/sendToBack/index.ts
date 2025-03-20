import maxBy from 'lodash-es/maxBy';
import minBy from 'lodash-es/minBy';
import xorBy from 'lodash-es/xorBy';
import type { DashboardState } from '../../state';
import { getWidgets } from '~/hooks/useSelectedWidget';

export interface SendWidgetsToBackAction {
  type: 'SEND_WIDGETS_TO_BACK';
}

export const onSendWidgetsToBackAction = (): SendWidgetsToBackAction => ({
  type: 'SEND_WIDGETS_TO_BACK',
});

export const sendWidgetsToBack = (state: DashboardState): DashboardState => {
  const selectedWidgets = getWidgets(
    state.selectedWidgetIds,
    state.dashboardConfiguration.widgets
  );
  const unselectedWidgets = xorBy(
    state.dashboardConfiguration.widgets,
    selectedWidgets,
    'id'
  );

  // We don't need to do anything if all widgets are selected
  if (unselectedWidgets.length === 0) return state;

  const bottomZIndex = minBy(unselectedWidgets, 'z')?.z ?? 0;
  const maxSelectedZ = maxBy(selectedWidgets, 'z')?.z ?? 0;
  const zOffset = bottomZIndex - 1 - maxSelectedZ;
  const translatedWidgets = state.dashboardConfiguration.widgets.map(
    (widget) => ({
      ...widget,
      z: state.selectedWidgetIds.includes(widget.id)
        ? widget.z + zOffset
        : widget.z,
    })
  );

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: translatedWidgets,
    },
  };
};
