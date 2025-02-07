import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { type DashboardState, initialState } from '../../state';
import { deleteWidgets, onDeleteWidgetsAction } from './index';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const setupDashboardState = (
  widgets: WidgetInstance[] = []
): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
});

it('returns no widget-instance when deleting widget-instance from an empty dashboard', () => {
  expect(
    deleteWidgets(
      setupDashboardState(),
      onDeleteWidgetsAction({
        widgetIds: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('returns original dashboard when no widget-instance are specified to be deleted', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('removes widget-instance to be delete from dashboard configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('does not remove any widget-instance when widget id specified is not present in the dashbaord configuration', () => {
  expect(
    deleteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onDeleteWidgetsAction({
        widgetIds: [MockWidgetFactory.getKpiWidget({ id: 'does-not-exit' })],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('only deletes widget that is specified to be deleted when there are multiple widget-instance present', () => {
  const widget1 = MockWidgetFactory.getKpiWidget({ id: 'widget-1' });
  const widget2 = MockWidgetFactory.getKpiWidget({ id: 'widget-2' });
  const widget3 = MockWidgetFactory.getKpiWidget({ id: 'widget-3' });

  expect(
    deleteWidgets(
      setupDashboardState([widget1, widget2, widget3]),
      onDeleteWidgetsAction({
        widgetIds: [widget1, widget2],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([widget3]);
});
