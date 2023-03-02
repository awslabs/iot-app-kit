import { copyWidgets, onCopyWidgetsAction } from '.';
import { DashboardState, initialState } from '../../state';

import { MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET, MOCK_SCATTER_CHART_WIDGET } from '../../../../testing/mocks';
import { Widget } from '~/types';

const setupDashboardState = (widgets: Widget[] = [], pasteCounter = 0): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  pasteCounter,
});

it('does nothing if no widgets are provided', () => {
  expect(
    copyWidgets(
      setupDashboardState(),
      onCopyWidgetsAction({
        widgets: [],
      })
    ).copiedWidgets
  ).toEqual([]);
});

it('adds one widget to the copy group', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onCopyWidgetsAction({
        widgets: [MOCK_KPI_WIDGET],
      })
    ).copiedWidgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('adds many widgets to the copy group', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]),
      onCopyWidgetsAction({
        widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
      })
    ).copiedWidgets
  ).toEqual([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]);
});

it('does not add a widget to the copy group that is not in the configuration', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]),
      onCopyWidgetsAction({
        widgets: [MOCK_SCATTER_CHART_WIDGET],
      })
    ).copiedWidgets
  ).toEqual([]);
});

it('resets paste counter', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], 10),
      onCopyWidgetsAction({
        widgets: [MOCK_KPI_WIDGET],
      })
    ).pasteCounter
  ).toEqual(0);
});
