import { mapWidgets } from './mapWidgets';

import {
  MockDashboardFactory,
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../testing/mocks';

it('applies a function across the widgets in a dashboard configuration', () => {
  const dashboardConfiguration = MockDashboardFactory.get({
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
  });

  expect(mapWidgets(dashboardConfiguration, (widget) => ({ ...widget, height: 111, width: 111 }))).toEqual({
    ...dashboardConfiguration,
    widgets: [
      { ...MOCK_KPI_WIDGET, height: 111, width: 111 },
      { ...MOCK_LINE_CHART_WIDGET, height: 111, width: 111 },
      { ...MOCK_SCATTER_CHART_WIDGET, height: 111, width: 111 },
    ],
  });
});
