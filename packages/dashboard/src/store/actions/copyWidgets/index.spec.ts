import { copyWidgets, onCopyWidgetsAction } from '.';
import type { DashboardState } from '../../state';
import { initialState } from '../../state';

import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import type { DashboardWidget } from '~/types';

const setupDashboardState = (
  widgets: DashboardWidget[] = [],
  pasteCounter = 0
): DashboardState => ({
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
        widgetIds: [],
      })
    ).copiedWidgetIds
  ).toEqual([]);
});

it('adds one widget to the copy group', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET]),
      onCopyWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id],
      })
    ).copiedWidgetIds
  ).toEqual([MOCK_KPI_WIDGET.id]);
});

it('adds many widgets to the copy group', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]),
      onCopyWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      })
    ).copiedWidgetIds
  ).toEqual([MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]);
});

it('resets paste counter', () => {
  expect(
    copyWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], 10),
      onCopyWidgetsAction({
        widgetIds: [MOCK_KPI_WIDGET.id],
      })
    ).pasteCounter
  ).toEqual(0);
});
