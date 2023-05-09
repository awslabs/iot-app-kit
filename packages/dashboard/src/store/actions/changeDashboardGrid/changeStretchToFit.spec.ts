import { changeDashboardStretchToFit, onChangeDashboardStretchToFitAction } from './changeStretchToFit';
import { initialState } from '../../state';

it('can toggle the dashboard to stretch to fit', () => {
  expect(
    changeDashboardStretchToFit(
      initialState,
      onChangeDashboardStretchToFitAction({
        stretchToFit: false,
      })
    ).grid.stretchToFit
  ).toEqual(false);

  expect(
    changeDashboardStretchToFit(
      initialState,
      onChangeDashboardStretchToFitAction({
        stretchToFit: true,
      })
    ).grid.stretchToFit
  ).toEqual(true);
});
