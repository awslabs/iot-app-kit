import uniqBy from 'lodash-es/uniqBy';
import type { Action } from 'redux';
import type { DashboardState } from '../../state';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface SelectWidgetsActionPayload {
  widgets: WidgetInstance[];
  union: boolean;
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
  action: SelectWidgetsAction
): DashboardState => ({
  ...state,
  selectedWidgets: action.payload.union
    ? uniqBy([...state.selectedWidgets, ...action.payload.widgets], 'id')
    : action.payload.widgets,
});
