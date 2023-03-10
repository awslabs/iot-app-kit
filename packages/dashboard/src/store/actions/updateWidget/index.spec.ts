import { onUpdateWidgetsAction, updateWidgets } from '.';
import { DashboardState, initialState } from '../../state';

import { MOCK_TEXT_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { Widget } from '~/types';

const setupDashboardState = (widgets: Widget[] = []): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
});

it('does nothing if no widgets are provided', () => {
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

it('updates multiple widgets to a dashboard', () => {
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
