import { MOCK_TEXT_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { initialState, type DashboardState } from '../../state';
import { onUpdateWidgetsAction, updateWidgets } from './index';
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

it('does nothing if no widget-instance are provided', () => {
  expect(
    updateWidgets(
      setupDashboardState(),
      onUpdateWidgetsAction({
        widgets: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('updates a widget on the dashboard', () => {
  const updatedWidget = { ...MOCK_TEXT_WIDGET, text: 'updated text content' };

  expect(
    updateWidgets(
      setupDashboardState([MOCK_TEXT_WIDGET]),
      onUpdateWidgetsAction({
        widgets: [updatedWidget],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([updatedWidget]);
});

it('updates multiple widget-instance to a dashboard', () => {
  const widgetA = MockWidgetFactory.getTextWidget({ id: 'widgetA' });
  const widgetB = MockWidgetFactory.getTextWidget({ id: 'widgetB' });

  const updatedWidgetA = { ...widgetA, text: 'updated text content A' };
  const updatedWidgetB = { ...widgetB, text: 'updated text content B' };

  expect(
    updateWidgets(
      setupDashboardState([widgetA, widgetB]),
      onUpdateWidgetsAction({
        widgets: [updatedWidgetA, updatedWidgetB],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([updatedWidgetA, updatedWidgetB]);
});
