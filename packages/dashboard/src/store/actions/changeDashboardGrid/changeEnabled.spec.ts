import { initialState } from '../../state';
import {
  changeDashboardGridDragEnabled,
  onChangeDashboardGridEnabledAction,
} from './changeEnabled';

it('can change grid enabled', () => {
  expect(
    changeDashboardGridDragEnabled(
      initialState,
      onChangeDashboardGridEnabledAction({
        enabled: false,
      })
    ).grid.enabled
  ).toEqual(false);

  expect(
    changeDashboardGridDragEnabled(
      initialState,
      onChangeDashboardGridEnabledAction({
        enabled: true,
      })
    ).grid.enabled
  ).toEqual(true);
});
