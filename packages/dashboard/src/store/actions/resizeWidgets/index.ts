import { getSelectionBox } from '~/util/getSelectionBox';
import { trimRectPosition } from '~/util/trimRectPosition';
import type { Action } from 'redux';
import type { Position } from '~/types';
import type { DashboardState } from '../../state';
import { transformWidget } from '~/util/transformWidget';
import { resizeSelectionBox } from '~/util/resizeSelectionBox';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export type Anchor =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';

export interface ResizeWidgetsActionPayload {
  anchor: Anchor;
  widgets: WidgetInstance[];
  vector: Position;
  complete?: boolean;
}

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
  { payload: { anchor, widgets, vector, complete } }: ResizeWidgetsAction
): DashboardState => {
  const selectedWidgetIds = widgets.map((w) => w.id);
  const selectionBox = getSelectionBox(widgets);

  if (!selectionBox) return state;

  const newSelectionBox = resizeSelectionBox({
    selectionBox,
    anchor,
    vector,
    grid: state.grid,
  });

  const resizer = (widget: WidgetInstance) =>
    transformWidget(
      widget,
      selectionBox,
      complete ? trimRectPosition(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: WidgetInstance[]) =>
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
