import { Action } from 'redux';

import { DashboardState } from '../../state';
import { changeGridProperty } from './updateGrid';

type ChangeDashboardGridEnabledPayload = {
  enabled: boolean;
};
export interface ChangeDashboardGridEnabledAction extends Action {
  type: 'CHANGE_ENABLED';
  payload?: ChangeDashboardGridEnabledPayload;
}

export const onChangeDashboardGridEnabledAction = (
  payload?: ChangeDashboardGridEnabledPayload
): ChangeDashboardGridEnabledAction => ({
  type: 'CHANGE_ENABLED',
  payload,
});

export const changeDashboardGridDragEnabled = (
  state: DashboardState,
  action: ChangeDashboardGridEnabledAction
): DashboardState =>
  changeGridProperty(state, 'enabled', action.payload ? action.payload.enabled : !state.grid.enabled);
