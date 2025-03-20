import type { Action } from 'redux';
import { nonNegative } from '~/util/number';
import type { DashboardState } from '../../state';
import { changeGridProperty } from './updateGrid';

export interface ChangeDashboardHeightActionPayload {
  height: number;
}

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

export const changeDashboardHeight = (
  state: DashboardState,
  action: ChangeDashboardHeightAction
): DashboardState =>
  changeGridProperty(state, 'height', nonNegative(action.payload.height));
