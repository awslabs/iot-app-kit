import { Action } from 'redux';

import { Widget } from '../../../types';
import { DashboardState } from '../../state';

type SelectWidgetsActionPayload = {
  widgets: Widget[];
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
  selectedWidgets: action.payload.widgets,
});
