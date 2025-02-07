import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import { initialState, type DashboardState } from '../../state';
import { toggleReadOnly } from './index';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const setupDashboardState = (
  widgets: WidgetInstance[] = [],
  pasteCounter = 0
): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  pasteCounter,
  readOnly: false,
});

it('can toggle the state if no widget-instance are present', () => {
  expect(toggleReadOnly(setupDashboardState([])).readOnly).toEqual(true);
});

it('can toggle the state if widget-instance are present', () => {
  expect(
    toggleReadOnly(
      setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET])
    ).readOnly
  ).toEqual(true);
});

it('can toggle the state back and forth', () => {
  expect(
    toggleReadOnly(
      toggleReadOnly(
        setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET])
      )
    ).readOnly
  ).toEqual(false);
});
