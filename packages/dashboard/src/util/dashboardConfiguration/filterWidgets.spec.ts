import { filterWidgets } from './filterWidgets';

import {
  MockDashboardFactory,
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../testing/mocks';

it('filters widgets in a dashboard configuration', () => {
  const dashboardConfiguration = MockDashboardFactory.get({
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
  });

  expect(filterWidgets(dashboardConfiguration, (widget) => widget.id !== MOCK_KPI_WIDGET.id)).toEqual({
    ...dashboardConfiguration,
    widgets: [MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
  });
});

it('does not remove any widgets if the compare func is not true for any widgets', () => {
  const dashboardConfiguration = MockDashboardFactory.get({
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
  });

  expect(filterWidgets(dashboardConfiguration, (widget) => widget.id === 'some-bogus-id')).toEqual({
    ...dashboardConfiguration,
    widgets: [],
  });
});
