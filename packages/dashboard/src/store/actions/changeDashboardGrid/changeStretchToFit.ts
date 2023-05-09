import { changeGridProperty } from './updateGrid';
import type { Action } from 'redux';
import type { DashboardState } from '../../state';

type ChangeDashboardStretchToFitActionPayload = {
  stretchToFit: boolean;
};
export interface ChangeDashboardStretchToFitAction extends Action {
  type: 'CHANGE_STRETCH_TO_FIT';
  payload: ChangeDashboardStretchToFitActionPayload;
}

export const onChangeDashboardStretchToFitAction = (
  payload: ChangeDashboardStretchToFitActionPayload
): ChangeDashboardStretchToFitAction => ({
  type: 'CHANGE_STRETCH_TO_FIT',
  payload,
});

export const changeDashboardStretchToFit = (
  state: DashboardState,
  action: ChangeDashboardStretchToFitAction
): DashboardState => changeGridProperty(state, 'stretchToFit', action.payload.stretchToFit);
