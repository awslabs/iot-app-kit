import { getSelectionBox } from '~/util/getSelectionBox';
import { trimRectPosition } from '~/util/trimRectPosition';
import type { Action } from 'redux';
import type { DashboardWidget, Position } from '~/types';
import type { DashboardState } from '../../state';
import { transformWidget } from '~/util/transformWidget';
import { resizeSelectionBox } from '~/util/resizeSelectionBox';
import { getWidgets } from '~/hooks/useSelectedWidget';

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
  widgetIds: readonly string[];
  anchor: Anchor;
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
  { payload: { widgetIds, anchor, vector, complete } }: ResizeWidgetsAction
): DashboardState => {
  const selectedWidgets = getWidgets(
    widgetIds,
    state.dashboardConfiguration.widgets
  );

  const selectionBox = getSelectionBox(selectedWidgets);

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
      complete ? trimRectPosition(newSelectionBox) : newSelectionBox
    );

  const updateWidgets = (widgets: DashboardWidget[]) =>
    widgets.map((widget) => {
      if (!widgetIds.includes(widget.id)) return widget;
      return resizer(widget);
    });

  const widgets = updateWidgets(state.dashboardConfiguration.widgets);

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets,
    },
  };
};
