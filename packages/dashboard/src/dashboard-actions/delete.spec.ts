import { DashboardConfiguration } from '../types';
import { deleteWidgets } from './delete';
import { MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, MockWidgetFactory, MockDashboardFactory } from '../testing/mocks';

it('returns no widgets when deleting widgets from an empty dashboard', () => {
  expect(
    deleteWidgets({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      widgetIdsToDelete: ['fake'],
    })
  ).toEqual(MOCK_EMPTY_DASHBOARD);
});

it('returns original dashboard when no widgets are specified to be deleted', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });

  expect(
    deleteWidgets({
      dashboardConfiguration,
      widgetIdsToDelete: [],
    })
  ).toEqual({ ...dashboardConfiguration });
});

it('removes widgets to be delete from dashboard configuration', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });

  expect(
    deleteWidgets({
      dashboardConfiguration,
      widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
    })
  ).toEqual({ ...dashboardConfiguration, widgets: [] });
});

it('does not remove any widgets when widget id specified is not present in the dashbaord configuration', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });

  expect(
    deleteWidgets({
      dashboardConfiguration,
      widgetIdsToDelete: ['fake'],
    })
  ).toEqual({ ...dashboardConfiguration });
});

it('only deletes widget that is specified to be deleted when there are multiple widgets present', () => {
  const WIDGET_2 = MockWidgetFactory.getKpiWidget();
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET, WIDGET_2] });
  expect(
    deleteWidgets({
      dashboardConfiguration,
      widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
    })
  ).toEqual({ ...dashboardConfiguration, widgets: [WIDGET_2] });
});
