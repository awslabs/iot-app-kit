import uniqBy from 'lodash/uniqBy';
import type { Action } from 'redux';
import type { DashboardWidget } from '~/types';
import type { DashboardState } from '../../state';

type SelectWidgetsActionPayload = {
  widgets: DashboardWidget[];
  union: boolean;
};

export interface SelectWidgetsAction extends Action {
  type: 'SELECT_WIDGETS';
  payload: SelectWidgetsActionPayload;
}

export const onSelectWidgetsAction = (payload: SelectWidgetsActionPayload): SelectWidgetsAction => ({
  type: 'SELECT_WIDGETS',
  payload,
});

export const selectWidgets = (state: DashboardState, action: SelectWidgetsAction): DashboardState => ({
  ...state,
  selectedWidgets: action.payload.union
    ? uniqBy([...state.selectedWidgets, ...action.payload.widgets], 'id')
    : action.payload.widgets,
});
