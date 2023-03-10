import { Action } from 'redux';

import { Position, Widget } from '~/types';
import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { DashboardState } from '../../state';

type MoveWidgetsActionPayload = {
  widgets: Widget[];
  vector: Position;
  complete?: boolean;
};

export interface MoveWidgetsAction extends Action {
  type: 'MOVE_WIDGETS';
  payload: MoveWidgetsActionPayload;
}

export const onMoveWidgetsAction = (payload: MoveWidgetsActionPayload): MoveWidgetsAction => ({
  type: 'MOVE_WIDGETS',
  payload,
});

export const moveWidgets = (state: DashboardState, action: MoveWidgetsAction): DashboardState => {
  const vector = action.payload.vector;
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgetIds = action.payload.widgets.map((w) => w.id);
  const movedWidgets = widgets.map((w) => {
    if (!selectedWidgetIds.includes(w.id)) {
      return w;
    }

    const widget = { ...w, x: w.x + vector.x, y: w.y + vector.y };
    const constrainedWidget = constrainWidgetPositionToGrid(
      { x: 0, y: 0, width: state.grid.width, height: state.grid.height },
      widget
    );
    return action.payload.complete ? trimWidgetPosition(constrainedWidget) : constrainedWidget;
  });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: movedWidgets,
    },
    selectedWidgets: movedWidgets.filter((w) => selectedWidgetIds.includes(w.id)),
  };
};
