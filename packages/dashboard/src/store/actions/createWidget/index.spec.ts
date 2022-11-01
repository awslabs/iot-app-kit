import { createWidgets, onCreateWidgetsAction } from '.';
import { initialState } from '../../state';

import { MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET } from '../../../../testing/mocks';

it('does nothing if no widgets are provided', () => {
  expect(
    createWidgets(
      initialState,
      onCreateWidgetsAction({
        widgets: [],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([]);
});

it('adds a widget to an empty dashboard', () => {
  expect(
    createWidgets(
      initialState,
      onCreateWidgetsAction({
        widgets: [MOCK_KPI_WIDGET],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('adds a widget to a dashboard with existing widgets', () => {
  const state = createWidgets(
    initialState,
    onCreateWidgetsAction({
      widgets: [MOCK_KPI_WIDGET],
    })
  );

  expect(
    createWidgets(
      state,
      onCreateWidgetsAction({
        widgets: [MOCK_LINE_CHART_WIDGET],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]);
});

it('adds multiple widgets to a dashboard with existing widgets', () => {
  const state = createWidgets(
    initialState,
    onCreateWidgetsAction({
      widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
    })
  );

  expect(
    createWidgets(
      state,
      onCreateWidgetsAction({
        widgets: [MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
      })
    ).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET]);
});
