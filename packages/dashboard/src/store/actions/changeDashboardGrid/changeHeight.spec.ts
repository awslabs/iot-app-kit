import { changeDashboardHeight, onChangeDashboardHeightAction } from './changeHeight';
import { initialState } from '../../state';
import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';

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

it('can update the widget selection with changed height of the dashboard', () => {
  const store = {
    ...initialState,
    dashboardConfiguration: {
      ...initialState.dashboardConfiguration,
      widgets: [{ ...MOCK_LINE_CHART_WIDGET }],
    },
    selectedWidgets: [{ ...MOCK_LINE_CHART_WIDGET }],
  };
  const updatedStore = changeDashboardHeight(
    store,
    onChangeDashboardHeightAction({
      height: 10,
    })
  );
  expect(updatedStore.selectedWidgets[0].height).toEqual(10);
  expect(
    changeDashboardHeight(
      updatedStore,
      onChangeDashboardHeightAction({
        height: 100,
      })
    ).selectedWidgets[0].height
  ).toEqual(20);
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
