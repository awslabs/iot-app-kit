import { changeDashboardWidth, onChangeDashboardWidthAction } from './changeWidth';
import { initialState } from '../../state';

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
