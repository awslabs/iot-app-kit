import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { getSelectionBox } from '~/util/getSelectionBox';
import { trimRectPosition } from '~/util/trimRectPosition';
import type { Action } from 'redux';
import type { Position, Widget } from '~/types';
import type { DashboardState } from '../../state';
import { resizeWidget } from '~/util/resizeWidget';
import { resizeSelectionBox } from '~/util/resizeSelectionBox';

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

type ResizeWidgetsActionPayload = {
  anchor: Anchor;
  widgets: Widget[];
  vector: Position;
  complete?: boolean;
};

export interface ResizeWidgetsAction extends Action {
  type: 'RESIZE_WIDGETS';
  payload: ResizeWidgetsActionPayload;
}

export const onResizeWidgetsAction = (payload: ResizeWidgetsActionPayload): ResizeWidgetsAction => ({
  type: 'RESIZE_WIDGETS',
  payload,
});

export const resizeWidgets = (state: DashboardState, action: ResizeWidgetsAction): DashboardState => {
  const { anchor, widgets, vector, complete } = action.payload;

  const selectedWidgetIds = widgets.map((w) => w.id);

  const selectionBox = getSelectionBox(widgets);

  if (!selectionBox) return state;

  const newSelectionBox = constrainWidgetPositionToGrid(
    {
      x: 0,
      y: 0,
      width: state.grid.width,
      height: state.grid.height,
    },
    resizeSelectionBox({ selectionBox, anchor, vector })
  );
  const resizer = (widget: Widget) =>
    resizeWidget(widget, selectionBox, complete ? trimRectPosition(newSelectionBox) : newSelectionBox);

  const updateWidgets = (widgets: Widget[]) =>
    widgets.map((widget) => {
      if (!selectedWidgetIds.includes(widget.id)) return widget;
      return resizer(widget);
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
