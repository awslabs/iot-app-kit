import { Action } from 'redux';
import uniqBy from 'lodash/uniqBy';

import { Widget } from '../../../types';
import { DashboardState } from '../../state';

type SelectWidgetsActionPayload = {
  widgets: Widget[];
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
