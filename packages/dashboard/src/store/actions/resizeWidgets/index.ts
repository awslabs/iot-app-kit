import type { Action } from 'redux';
import type { DashboardWidget, Position } from '../../../types';
import { getSelectionBox } from '../../../grid/rectangle/surround';
import { resizeSelectionBox } from '../../../grid/rectangle/stretch';
import { transformWidget } from '../../../grid/rectangle/scale';
import { createRectangle } from '../../../grid/rectangle/create';
import type { DashboardState } from '../../state-old';
import { Anchor } from '#grid/rectangle/types';

type ResizeWidgetsActionPayload = {
  anchor: Anchor;
  widgets: DashboardWidget[];
  vector: Position;
  complete?: boolean;
};

export interface ResizeWidgetsAction extends Action {
  type: 'RESIZE_WIDGETS';
  payload: ResizeWidgetsActionPayload;
}

export const onResizeWidgetsAction = (
  payload: ResizeWidgetsActionPayload
): ResizeWidgetsAction => ({
  type: 'RESIZE_WIDGETS',
  payload,
});

export const resizeWidgets = (
  state: DashboardState,
  action: ResizeWidgetsAction
): DashboardState => {
  const { anchor, widgets, vector, complete } = action.payload;

  const selectedWidgetIds = widgets.map((w) => w.id);

  const selectionBox = getSelectionBox(widgets);

  if (!selectionBox) return state;

  const newSelectionBox = resizeSelectionBox({
    selectionBox,
    anchor,
    vector,
    grid: state.grid,
  });

  const resizer = (widget: DashboardWidget) =>
    transformWidget(
      widget,
      selectionBox,
      complete ? createRectangle(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: DashboardWidget[]) =>
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
