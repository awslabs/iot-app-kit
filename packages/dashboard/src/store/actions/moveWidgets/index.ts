import type { Action } from 'redux';
import type { Position } from '~/types';
import { trimRectPosition } from '~/util/trimRectPosition';
import { getSelectionBox } from '~/util/getSelectionBox';
import { moveSelectionBox } from '~/util/moveSelectionBox';
import { transformWidget } from '~/util/transformWidget';
import type { DashboardState } from '../../state';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface MoveWidgetsActionPayload {
  widgets: WidgetInstance[];
  vector: Position;
  complete?: boolean;
}

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

  const mover = (widget: WidgetInstance) =>
    transformWidget(
      widget,
      selectionBox,
      complete ? trimRectPosition(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: WidgetInstance[]) =>
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
