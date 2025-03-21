import { trimRectPosition } from '~/util/trimRectPosition';
import type { Action } from 'redux';
import type { DashboardWidget, Position } from '~/types';
import type { DashboardState } from '../../state';
import { getSelectionBox } from '~/util/getSelectionBox';
import { moveSelectionBox } from '~/util/moveSelectionBox';
import { transformWidget } from '~/util/transformWidget';
import { getWidgets } from '~/hooks/useSelectedWidget';

interface MoveWidgetsActionPayload {
  widgetIds: readonly string[];
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
  { payload: { widgetIds, vector, complete } }: MoveWidgetsAction
): DashboardState => {
  const selectedWidgets = getWidgets(
    widgetIds,
    state.dashboardConfiguration.widgets
  );
  const selectionBox = getSelectionBox(selectedWidgets);
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
      complete ? trimRectPosition(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: DashboardWidget[]) =>
    widgets.map((widget) => {
      if (!widgetIds.includes(widget.id)) return widget;
      return mover(widget);
    });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: updateWidgets(state.dashboardConfiguration.widgets),
    },
  };
};
