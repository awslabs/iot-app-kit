import { initialState } from '../../../store/state';
import { onUpdateRefreshRateAction, updateRefreshRate } from './index';

it('it intiializes to 5 seconds', () => {
  expect(
    initialState.dashboardConfiguration.querySettings?.refreshRate
  ).toEqual(5000);
});
it('can change refresh rate', () => {
  expect(
    updateRefreshRate(
      initialState,
      onUpdateRefreshRateAction({
        refreshRate: 1000,
      })
    ).dashboardConfiguration.querySettings?.refreshRate
  ).toEqual(1000);

  expect(
    updateRefreshRate(
      initialState,
      onUpdateRefreshRateAction({
        refreshRate: 10000,
      })
    ).dashboardConfiguration.querySettings?.refreshRate
  ).toEqual(10000);
});
