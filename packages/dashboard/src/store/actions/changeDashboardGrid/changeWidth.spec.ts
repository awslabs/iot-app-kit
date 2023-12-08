import { changeDashboardWidth, onChangeDashboardWidthAction } from './changeWidth';
import { initialState } from '../../state';
import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';

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

it('can update the widget selection with changed width of the dashboard', () => {
  const store = {
    ...initialState,
    dashboardConfiguration: {
      ...initialState.dashboardConfiguration,
      widgets: [{ ...MOCK_LINE_CHART_WIDGET }],
    },
    selectedWidgets: [{ ...MOCK_LINE_CHART_WIDGET }],
  };
  const updatedStore = changeDashboardWidth(
    store,
    onChangeDashboardWidthAction({
      width: 10,
    })
  );
  expect(updatedStore.selectedWidgets[0].width).toEqual(10);
  expect(
    changeDashboardWidth(
      updatedStore,
      onChangeDashboardWidthAction({
        width: 100,
      })
    ).selectedWidgets[0].width
  ).toEqual(33);
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
