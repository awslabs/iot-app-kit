import { concatWidgets } from './concatWidgets';

import {
  MockDashboardFactory,
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../testing/mocks';

it('adds widgets to a dashboard configuration', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });

  expect(concatWidgets(dashboardConfiguration, [MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET])).toEqual({
    ...dashboardConfiguration,
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
  });

  expect(concatWidgets(dashboardConfiguration, [])).toEqual({
    ...dashboardConfiguration,
    widgets: [MOCK_KPI_WIDGET],
  });
});
