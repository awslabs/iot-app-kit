import { DashboardConfiguration } from '../types';
import { createWidget } from './createWidget';
import {
  MOCK_EMPTY_DASHBOARD,
  MOCK_KPI_WIDGET,
  MockWidgetFactory,
  MockDashboardFactory,
  MOCK_LINE_CHART_WIDGET,
} from '../testing/mocks';

it('adds widget to empty dashboard', () => {
  expect(
    createWidget({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      widgets: [MOCK_KPI_WIDGET],
    }).widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('adds widget to dashboard with existing widgets', () => {
  const dashboardConfiguration: DashboardConfiguration = {
    widgets: [MOCK_KPI_WIDGET],
    viewport: { duration: '5m' },
  };
  const expectedOutput: DashboardConfiguration = {
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
    viewport: { duration: '5m' },
  };

  expect(
    createWidget({
      dashboardConfiguration,
      widgets: [MOCK_LINE_CHART_WIDGET],
    })
  ).toEqual(expectedOutput);
});
