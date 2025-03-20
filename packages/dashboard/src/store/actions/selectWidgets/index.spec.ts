import { onSelectWidgetsAction, selectWidgets } from '.';
import type { DashboardState } from '../../state';
import { initialState } from '../../state';

import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
} from '../../../../testing/mocks';

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

it('does nothing if no widgets are provided', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgetIds: [],
        shouldAppend: false,
      })
    ).selectedWidgetIds
  ).toEqual([]);
});

it('selects a single widget', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id],
        shouldAppend: false,
      })
    ).selectedWidgetIds
  ).toEqual([MOCK_KPI_WIDGET.id]);
});

it('selects multiple widget', () => {
  expect(
    selectWidgets(
      dashboardState,
      onSelectWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
        shouldAppend: false,
      })
    ).selectedWidgetIds
  ).toEqual([MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]);
});

it('adds a single widget to a selection', () => {
  const state = selectWidgets(
    dashboardState,
    onSelectWidgetsAction({
      widgetIds: [MOCK_KPI_WIDGET.id],
      shouldAppend: false,
    })
  );

  expect(
    selectWidgets(
      state,
      onSelectWidgetsAction({
        widgetIds: [MOCK_LINE_CHART_WIDGET.id],
        shouldAppend: true,
      })
    ).selectedWidgetIds
  ).toEqual([MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]);
});

it('adds multiple widgets to a selection', () => {
  const state = selectWidgets(
    dashboardState,
    onSelectWidgetsAction({
      widgetIds: [MOCK_KPI_WIDGET.id],
      shouldAppend: false,
    })
  );

  expect(
    selectWidgets(
      state,
      onSelectWidgetsAction({
        widgetIds: [MOCK_LINE_CHART_WIDGET.id, MOCK_SCATTER_CHART_WIDGET.id],
        shouldAppend: true,
      })
    ).selectedWidgetIds
  ).toEqual([
    MOCK_KPI_WIDGET.id,
    MOCK_LINE_CHART_WIDGET.id,
    MOCK_SCATTER_CHART_WIDGET.id,
  ]);
});
