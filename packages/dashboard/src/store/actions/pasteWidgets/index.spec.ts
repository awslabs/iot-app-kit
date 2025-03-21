import { onPasteWidgetsAction, pasteWidgets } from '.';
import type { DashboardState } from '../../state';
import { initialState } from '../../state';

import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import type { DashboardWidget } from '~/types';

const setupDashboardState = (
  widgets: DashboardWidget[] = [],
  copiedWidgetIds: readonly string[] = []
): DashboardState => ({
  ...initialState,
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 10,
  },
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  copiedWidgetIds,
});

it('does nothing when pasting with nothing in the copy group', () => {
  expect(
    pasteWidgets(setupDashboardState(), onPasteWidgetsAction({}))
      .dashboardConfiguration.widgets
  ).toEqual([]);
});

it('paste single widget', () => {
  expect(
    pasteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET.id]),
      onPasteWidgetsAction({})
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x + 1,
        y: MOCK_KPI_WIDGET.y + 1,
      }),
    ])
  );
});

it('paste single widget a second time, shifts the position down', () => {
  const state = pasteWidgets(
    setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET.id]),
    onPasteWidgetsAction({})
  );

  expect(
    pasteWidgets(state, onPasteWidgetsAction({})).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x + 1,
        y: MOCK_KPI_WIDGET.y + 1,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x + 2,
        y: MOCK_KPI_WIDGET.y + 2,
      }),
    ])
  );
});

it('paste multiple widgets', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]
      ),
      onPasteWidgetsAction({})
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: MOCK_LINE_CHART_WIDGET.x,
        y: MOCK_LINE_CHART_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x + 1,
        y: MOCK_KPI_WIDGET.y + 1,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: MOCK_LINE_CHART_WIDGET.x + 1,
        y: MOCK_LINE_CHART_WIDGET.y + 1,
      }),
    ])
  );
});

it('pastes a widget at a specific location', () => {
  expect(
    pasteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET.id]),
      onPasteWidgetsAction({
        position: { x: 100, y: 100 },
      })
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: 10,
        y: 10,
      }),
    ])
  );
});

it('pastes multiple widgets at a specific location', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]
      ),
      onPasteWidgetsAction({
        position: { x: 100, y: 100 },
      })
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: MOCK_LINE_CHART_WIDGET.x,
        y: MOCK_LINE_CHART_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: 10,
        y: 10,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: 12,
        y: 12,
      }),
    ])
  );
});

it('selects the widgets that are pasted', () => {
  const selectedWidgets = pasteWidgets(
    setupDashboardState(
      [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
      [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]
    ),
    onPasteWidgetsAction({
      position: { x: 100, y: 100 },
    })
  ).selectedWidgetIds;

  // the newly pasted widgets are selected
  expect(selectedWidgets).toEqual([expect.any(String), expect.any(String)]);

  // the initial copied widgets are not selected
  expect(selectedWidgets).not.toEqual([
    MOCK_KPI_WIDGET.id,
    MOCK_LINE_CHART_WIDGET.id,
  ]);
});

it('pastes a widget at right edge location', () => {
  expect(
    pasteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET.id]),
      onPasteWidgetsAction({
        position: { x: 1000, y: 1000 },
      })
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: 92,
        y: 95,
      }),
    ])
  );
});

it('pastes multiple widgets at right edge location', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id]
      ),
      onPasteWidgetsAction({
        position: { x: 1000, y: 1000 },
      })
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: MOCK_KPI_WIDGET.x,
        y: MOCK_KPI_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: MOCK_LINE_CHART_WIDGET.x,
        y: MOCK_LINE_CHART_WIDGET.y,
      }),
      expect.objectContaining({
        type: MOCK_KPI_WIDGET.type,
        x: 90,
        y: 93,
      }),
      expect.objectContaining({
        type: MOCK_LINE_CHART_WIDGET.type,
        x: 92,
        y: 95,
      }),
    ])
  );
});
