import { deleteWidgets, onDeleteWidgetsAction } from './index';
import type { DashboardState } from '../../state';
import { initialState } from '../../state';

import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import type { DashboardWidget } from '~/types';

const setupDashboardState = (
  widgets: DashboardWidget[] = []
): DashboardState => ({
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
        widgetIds: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('returns original dashboard when no widgets are specified to be deleted', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('removes widgets to be delete from dashboard configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('does not remove any widgets when widget id specified is not present in the dashbaord configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [MockWidgetFactory.getKpiWidget({ id: 'does-not-exit' }).id],
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
        widgetIds: [widget1.id, widget2.id],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([widget3]);
});
