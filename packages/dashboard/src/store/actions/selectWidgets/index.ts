import type { Action } from 'redux';
import type { DashboardState } from '../../state';

interface SelectWidgetsActionPayload {
  widgetIds: readonly string[];
  shouldAppend?: boolean;
}

export interface SelectWidgetsAction extends Action {
  type: 'SELECT_WIDGETS';
  payload: SelectWidgetsActionPayload;
}

export const onSelectWidgetsAction = (
  payload: SelectWidgetsActionPayload
): SelectWidgetsAction => ({
  type: 'SELECT_WIDGETS',
  payload,
});

export const selectWidgets = (
  state: DashboardState,
  { payload: { widgetIds, shouldAppend = false } }: SelectWidgetsAction
): DashboardState => ({
  ...state,
  selectedWidgetIds: shouldAppend
    ? [...new Set([...state.selectedWidgetIds, ...widgetIds])]
    : widgetIds,
});
