import type { Action } from 'redux';
import type { DashboardWidget, 2DPosition } from '../../../types';
import { getSelectionBox } from '../../../grid/rectangle/surround';
import { moveSelectionBox } from '../../../grid/rectangle/translate';
import { transformWidget } from '../../../grid/rectangle/scale';
import { createRectangle } from '../../../grid/rectangle/create';
import type { DashboardState } from '../../state-old';

type MoveWidgetsActionPayload = {
  widgets: DashboardWidget[];
  vector: 2DPosition;
  complete?: boolean;
};

export interface MoveWidgetsAction extends Action {
  type: 'MOVE_WIDGETS';
  payload: MoveWidgetsActionPayload;
}

export const onMoveWidgetsAction = (
  payload: MoveWidgetsActionPayload
): MoveWidgetsAction => ({
  type: 'MOVE_WIDGETS',
  payload,
});

export const moveWidgets = (
  state: DashboardState,
  action: MoveWidgetsAction
): DashboardState => {
  const { vector, complete, widgets } = action.payload;
  const selectedWidgetIds = action.payload.widgets.map((w) => w.id);
  const selectionBox = getSelectionBox(widgets);
  if (!selectionBox) return state;

  const newSelectionBox = moveSelectionBox({
    selectionBox,
    vector,
    grid: state.grid,
  });

  const mover = (widget: DashboardWidget) =>
    transformWidget(
      widget,
      selectionBox,
      complete ? createRectangle(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: DashboardWidget[]) =>
    widgets.map((widget) => {
      if (!selectedWidgetIds.includes(widget.id)) return widget;
      return mover(widget);
    });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: updateWidgets(state.dashboardConfiguration.widgets),
    },
    selectedWidgets: updateWidgets(state.selectedWidgets),
  };
};
