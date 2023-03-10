import { deleteWidgets, onDeleteWidgetsAction } from './index';
import { DashboardState, initialState } from '../../state';

import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { Widget } from '~/types';

const setupDashboardState = (widgets: Widget[] = []): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
});

it('returns no widgets when deleting widgets from an empty dashboard', () => {
  expect(
    deleteWidgets(
      setupDashboardState(),
      onDeleteWidgetsAction({
        widgets: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('returns original dashboard when no widgets are specified to be deleted', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgets: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('removes widgets to be delete from dashboard configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgets: [MOCK_KPI_WIDGET],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('does not remove any widgets when widget id specified is not present in the dashbaord configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgets: [MockWidgetFactory.getKpiWidget({ id: 'does-not-exit' })],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('only deletes widget that is specified to be deleted when there are multiple widgets present', () => {
  const widget1 = MockWidgetFactory.getKpiWidget({ id: 'widget-1' });
  const widget2 = MockWidgetFactory.getKpiWidget({ id: 'widget-2' });
  const widget3 = MockWidgetFactory.getKpiWidget({ id: 'widget-3' });

  expect(
    deleteWidgets(
      setupDashboardState([widget1, widget2, widget3]),
      onDeleteWidgetsAction({
        widgets: [widget1, widget2],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([widget3]);
});
