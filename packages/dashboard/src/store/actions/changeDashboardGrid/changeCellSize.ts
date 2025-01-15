import { changeGridProperty } from './updateGrid';
import type { Action } from 'redux';
import type { DashboardState } from '../../state';
import { nonNegative } from '~/util/number';

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
