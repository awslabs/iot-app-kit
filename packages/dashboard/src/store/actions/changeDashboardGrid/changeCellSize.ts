import type { Action } from 'redux';
import { nonNegative } from '../../../util/number';
import type { DashboardState } from '../../state-old';
import { changeGridProperty } from './updateGrid';

type ChangeDashboardCellSizeActionPayload = {
  cellSize: number;
};
export interface ChangeDashboardCellSizeAction extends Action {
  type: 'CHANGE_CELL_SIZE';
  payload: ChangeDashboardCellSizeActionPayload;
}

export const onChangeDashboardCellSizeAction = (
  payload: ChangeDashboardCellSizeActionPayload
): ChangeDashboardCellSizeAction => ({
  type: 'CHANGE_CELL_SIZE',
  payload,
});

// Prevent the dashboard from having a negative cell size which would make an invalid grid.
export const changeDashboardCellSize = (
  state: DashboardState,
  action: ChangeDashboardCellSizeAction
): DashboardState =>
  changeGridProperty(state, 'cellSize', nonNegative(action.payload.cellSize));
