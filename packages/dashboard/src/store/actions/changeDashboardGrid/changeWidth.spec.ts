import { initialState } from '../../state';
import {
  changeDashboardWidth,
  onChangeDashboardWidthAction,
} from './changeWidth';

it('can change the width of the dashboard', () => {
  expect(
    changeDashboardWidth(
      initialState,
      onChangeDashboardWidthAction({
        width: 10,
      })
    ).grid.width
  ).toEqual(10);
});

it('does not allow negative widths', () => {
  expect(
    changeDashboardWidth(
      initialState,
      onChangeDashboardWidthAction({
        width: -10,
      })
    ).grid.width
  ).toEqual(0);
});
