import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../../../testing/mocks';
import { initialState, type DashboardState } from '../../state';
import { selectWidgets, onSelectWidgetsAction } from './index';

const dashboardState: DashboardState = {
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets: [
      MOCK_KPI_WIDGET,
      MOCK_LINE_CHART_WIDGET,
      MOCK_SCATTER_CHART_WIDGET,
    ],
  },
};

it('does nothing if no widget-instance are provided', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgets: [],
        union: false,
      })
    ).selectedWidgets
  ).toEqual([]);
});

it('selects a single widget', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgets: [MOCK_KPI_WIDGET],
        union: false,
      })
    ).selectedWidgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('selects multiple widget', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        union: false,
      })
    ).selectedWidgets
  ).toEqual([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]);
});

it('adds a single widget to a selection', () => {
  const state = selectWidgets(
    dashboardState,
    onSelectWidgetsAction({
      widgets: [MOCK_KPI_WIDGET],
      union: false,
    })
  );

  expect(
    selectWidgets(
      state,
      onSelectWidgetsAction({
        widgets: [MOCK_LINE_CHART_WIDGET],
        union: true,
      })
    ).selectedWidgets
  ).toEqual([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]);
});

it('adds multiple widget-instance to a selection', () => {
  const state = selectWidgets(
    dashboardState,
    onSelectWidgetsAction({
      widgets: [MOCK_KPI_WIDGET],
      union: false,
    })
  );

  expect(
    selectWidgets(
      state,
      onSelectWidgetsAction({
        widgets: [MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET],
        union: true,
      })
    ).selectedWidgets
  ).toEqual([
    MOCK_KPI_WIDGET,
    MOCK_LINE_CHART_WIDGET,
    MOCK_SCATTER_CHART_WIDGET,
  ]);
});
