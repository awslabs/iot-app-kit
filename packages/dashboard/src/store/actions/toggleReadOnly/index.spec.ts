import { toggleReadOnly } from '.';
import { DashboardState, initialState } from '../../state';

import { MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';
import { Widget } from '~/types';

const setupDashboardState = (widgets: Widget[] = [], pasteCounter = 0): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  pasteCounter,
  readOnly: false,
});

it('can toggle the state if no widgets are present', () => {
  expect(toggleReadOnly(setupDashboardState([])).readOnly).toEqual(true);
});

it('can toggle the state if widgets are present', () => {
  expect(toggleReadOnly(setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET])).readOnly).toEqual(true);
});

it('can toggle the state back and forth', () => {
  expect(
    toggleReadOnly(toggleReadOnly(setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]))).readOnly
  ).toEqual(false);
});
