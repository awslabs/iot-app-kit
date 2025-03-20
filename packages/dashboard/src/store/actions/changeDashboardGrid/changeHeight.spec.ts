import { initialState } from '../../state';
import {
  changeDashboardHeight,
  onChangeDashboardHeightAction,
} from './changeHeight';

it('can change the height of the dashboard', () => {
  expect(
    changeDashboardHeight(
      initialState,
      onChangeDashboardHeightAction({
        height: 10,
      })
    ).grid.height
  ).toEqual(10);
});

it('does not allow negative heights', () => {
  expect(
    changeDashboardHeight(
      initialState,
      onChangeDashboardHeightAction({
        height: -10,
      })
    ).grid.height
  ).toEqual(0);
});
