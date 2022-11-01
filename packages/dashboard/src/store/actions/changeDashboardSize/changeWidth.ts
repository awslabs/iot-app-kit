import { Action } from 'redux';

import { DashboardState } from '../../state';
import { changeGridProperty } from './updateGrid';

type ChangeDashboardWidthActionPayload = {
  width: number;
};
export interface ChangeDashboardWidthAction extends Action {
  type: 'CHANGE_WIDTH';
  payload: ChangeDashboardWidthActionPayload;
}

export const onChangeDashboardWidthAction = (
  payload: ChangeDashboardWidthActionPayload
): ChangeDashboardWidthAction => ({
  type: 'CHANGE_WIDTH',
  payload,
});

export const changeDashboardWidth = (state: DashboardState, action: ChangeDashboardWidthAction): DashboardState =>
  changeGridProperty(state, 'width', Math.max(0, action.payload.width));
