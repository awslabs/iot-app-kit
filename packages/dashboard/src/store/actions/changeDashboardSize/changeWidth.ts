import { Action } from 'redux';

import { DashboardState } from '../../state';

type ChangeDashboardWidthActionPayload = {
  width: number;
};
export interface ChangeDashboardWidthAction extends Action {
  type: 'CHANGE_WIDTH';
  payload: ChangeDashboardWidthActionPayload;
}

export const onChangeDashboardWidthAction = (payload: ChangeDashboardWidthActionPayload): ChangeDashboardWidthAction => ({
  type: 'CHANGE_WIDTH',
  payload,
});

export const changeDashboardWidth = (state: DashboardState, action: ChangeDashboardWidthAction): DashboardState => ({
  ...state,
  width: action.payload.width,
});
