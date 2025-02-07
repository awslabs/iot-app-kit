import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../../../testing/mocks';
import { initialState } from '../../state';
import { createWidgets, onCreateWidgetsAction } from './index';

it('does nothing if no widget-instance are provided', () => {
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

it('adds a widget to a dashboard with existing widget-instance', () => {
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

it('adds multiple widget-instance to a dashboard with existing widget-instance', () => {
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
  ).toEqual([
    MOCK_KPI_WIDGET,
    MOCK_LINE_CHART_WIDGET,
    MOCK_LINE_CHART_WIDGET,
    MOCK_SCATTER_CHART_WIDGET,
  ]);
});

it('selects the widget-instance that are created', () => {
  const selectedWidgets = createWidgets(
    initialState,
    onCreateWidgetsAction({
      widgets: [MOCK_KPI_WIDGET],
    })
  ).selectedWidgets;

  expect(selectedWidgets).toEqual([MOCK_KPI_WIDGET]);
});
