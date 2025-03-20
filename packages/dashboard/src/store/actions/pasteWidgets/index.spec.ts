import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../../../../testing/mocks';
import { initialState, type DashboardState } from '../../state';
import { onPasteWidgetsAction, pasteWidgets } from './index';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const setupDashboardState = (
  widgets: WidgetInstance[] = [],
  copiedWidgets: WidgetInstance[] = []
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
  copiedWidgets,
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
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET]),
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
    setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET]),
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

it('paste multiple widget-instance', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]
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
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET]),
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

it('pastes multiple widget-instance at a specific location', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]
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

it('selects the widget-instance that are pasted', () => {
  const selectedWidgets = pasteWidgets(
    setupDashboardState(
      [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
      [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]
    ),
    onPasteWidgetsAction({
      position: { x: 100, y: 100 },
    })
  ).selectedWidgets;

  // the newly pasted widget-instance are selected
  expect(selectedWidgets).toEqual(
    expect.arrayContaining([
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

  // the initial copied widget-instance are not selected
  expect(selectedWidgets).not.toEqual(
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
    ])
  );
});

it('pastes a widget at right edge location', () => {
  expect(
    pasteWidgets(
      setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET]),
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

it('pastes multiple widget-instance at right edge location', () => {
  expect(
    pasteWidgets(
      setupDashboardState(
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET]
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
