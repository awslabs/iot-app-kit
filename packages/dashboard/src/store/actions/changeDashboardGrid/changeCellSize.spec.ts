import { initialState } from '../../state';
import {
  changeDashboardCellSize,
  onChangeDashboardCellSizeAction,
} from './changeCellSize';

it('can change grid cellSize', () => {
  expect(
    changeDashboardCellSize(
      initialState,
      onChangeDashboardCellSizeAction({
        cellSize: 10,
      })
    ).grid.cellSize
  ).toEqual(10);

  expect(
    changeDashboardCellSize(
      initialState,
      onChangeDashboardCellSizeAction({
        cellSize: 20,
      })
    ).grid.cellSize
  ).toEqual(20);
});
