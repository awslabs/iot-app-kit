import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import { initialState, type DashboardState } from '../../state';
import {
  assistantCleanWidgetsSelection,
  assistantDeselectWidgets,
  assistantSelectWidgets,
  onAssistantCleanWidgetsSelectionAction,
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from './index';

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
        widgetType: MOCK_KPI_WIDGET.type,
        selectedProperties: 1,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
    },
  ]);
});

it('selects two widget-instance', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
    })
  );

  expect(
    assistantSelectWidgets(
      state,
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_LINE_CHART_WIDGET.id,
        widgetType: MOCK_LINE_CHART_WIDGET.type,
        selectedProperties: 2,
      })
    ).assistant.selectedQueries
  ).toEqual([
    {
      widgetId: MOCK_KPI_WIDGET.id,
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
    },
    {
      widgetId: MOCK_LINE_CHART_WIDGET.id,
      widgetType: MOCK_LINE_CHART_WIDGET.type,
      selectedProperties: 2,
    },
  ]);
});

it('deselect a single widget', () => {
  const state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
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
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
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
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
    },
  ]);
});

it('clean all widget-instance selection', () => {
  let state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_KPI_WIDGET.id,
      widgetType: MOCK_KPI_WIDGET.type,
      selectedProperties: 1,
    })
  );

  state = assistantSelectWidgets(
    dashboardState,
    onAssistantSelectWidgetsAction({
      widgetId: MOCK_LINE_CHART_WIDGET.id,
      widgetType: MOCK_LINE_CHART_WIDGET.type,
      selectedProperties: 1,
    })
  );

  expect(
    assistantCleanWidgetsSelection(
      state,
      onAssistantCleanWidgetsSelectionAction()
    ).assistant.selectedQueries
  ).toEqual([]);
});
