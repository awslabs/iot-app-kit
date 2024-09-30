import {
  assistantCleanWidgetsSelection,
  assistantDeselectWidgets,
  assistantSelectWidgets,
  onAssistantCleanWidgetsSelectionAction,
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from '.';
import { initialState } from '../../state';
import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import type { DashboardState } from '../../state';

const dashboardState: DashboardState = {
  ...initialState,
  assistant: {
    ...initialState.assistant,
    selectedQueries: [],
  },
};

it('selects a single widget', () => {
  expect(
    assistantSelectWidgets(
      dashboardState,
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_KPI_WIDGET.id,
        queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    },
  ]);
});

it('selects two widgets', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    })
  );

  expect(
    assistantSelectWidgets(
      state,
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_LINE_CHART_WIDGET.id,
        queryConfig: MOCK_LINE_CHART_WIDGET.properties.queryConfig,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    },
    {
      widgetId: MOCK_LINE_CHART_WIDGET.id,
      queryConfig: MOCK_LINE_CHART_WIDGET.properties.queryConfig,
    },
  ]);
});

it('selects the same widget to a selection', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    })
  );

  expect(
    assistantSelectWidgets(
      state,
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_KPI_WIDGET.id,
        queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    },
  ]);
});

it('deselect a single widget', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    })
  );

  expect(
    assistantDeselectWidgets(
      state,
      onAssistantDeselectWidgetsAction({
        widgetId: MOCK_KPI_WIDGET.id,
      })
    ).assistant.selectedQueries
  ).toEqual([]);
});

it('does nothing if widget deselect was not previously selected', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    })
  );

  expect(
    assistantDeselectWidgets(
      state,
      onAssistantDeselectWidgetsAction({
        widgetId: MOCK_LINE_CHART_WIDGET.id,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    },
  ]);
});

it('clean all widgets selection', () => {
  let state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      queryConfig: MOCK_KPI_WIDGET.properties.queryConfig,
    })
  );

  state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_LINE_CHART_WIDGET.id,
      queryConfig: MOCK_LINE_CHART_WIDGET.properties.queryConfig,
    })
  );

  expect(
    assistantCleanWidgetsSelection(
      state,
      onAssistantCleanWidgetsSelectionAction()
    ).assistant.selectedQueries
  ).toEqual([]);
});
