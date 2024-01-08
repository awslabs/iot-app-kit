import { changeGridProperty } from './updateGrid';
import type { Action } from 'redux';
import type { DashboardState } from '../../state';
import { nonNegative } from '~/util/number';

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

export const changeDashboardHeight = (
  state: DashboardState,
  action: ChangeDashboardHeightAction
): DashboardState =>
  changeGridProperty(state, 'height', nonNegative(action.payload.height));
