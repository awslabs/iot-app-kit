import { Action } from 'redux';

import { DashboardState } from '../../state';
import { changeGridProperty } from './updateGrid';

type ChangeDashboardHeightActionPayload = {
  height: number;
};
export interface ChangeDashboardHeightAction extends Action {
  type: 'CHANGE_HEIGHT';
  payload: ChangeDashboardHeightActionPayload;
}

export const onChangeDashboardHeightAction = (
  payload: ChangeDashboardHeightActionPayload
): ChangeDashboardHeightAction => ({
  type: 'CHANGE_HEIGHT',
  payload,
});

export const changeDashboardHeight = (state: DashboardState, action: ChangeDashboardHeightAction): DashboardState =>
  changeGridProperty(state, 'height', Math.max(0, action.payload.height));
