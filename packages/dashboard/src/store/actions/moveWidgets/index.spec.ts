import { moveWidgets, onMoveWidgetsAction } from './index';
import { DashboardState, initialState } from '../../state';

import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import { Widget } from '~/types';

const setupDashboardState = (widgets: Widget[] = []): DashboardState => ({
  ...initialState,
  grid: {
    ...initialState.grid,
    width: 100,
    height: 100,
  },
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
});

describe('move', () => {
  it('does nothing if given an empty list of widgets', () => {
    expect(
      moveWidgets(
        setupDashboardState([MOCK_KPI_WIDGET]),
        onMoveWidgetsAction({
          widgets: [],
          vector: { x: 1, y: 0 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('shifts a single selected widget by a fractional amount when position changes slightly', () => {
    const widget = MockWidgetFactory.getKpiWidget({ x: 1, y: 1, width: 5, height: 5 });

    expect(
      moveWidgets(
        setupDashboardState([widget]),
        onMoveWidgetsAction({
          widgets: [widget],
          vector: { x: 0.1, y: 0.1 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1.1,
          y: 1.1,
        }),
      ])
    );
  });

  it('does not shift off of the grid', () => {
    const widget = MockWidgetFactory.getKpiWidget({ x: 0, y: 0, width: 5, height: 5 });
    const dashboardState = setupDashboardState([widget]);

    expect(
      moveWidgets(
        dashboardState,
        onMoveWidgetsAction({
          widgets: [widget],
          vector: { x: dashboardState.grid.width, y: 0 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: dashboardState.grid.width - widget.width,
          y: 0,
        }),
      ])
    );
  });

  it('does not shift widget that is not selected', () => {
    const widget1 = MockWidgetFactory.getKpiWidget({ x: 0, y: 0, width: 5, height: 5 });
    const widget2 = MockWidgetFactory.getKpiWidget({ x: 6, y: 6, width: 5, height: 5 });

    expect(
      moveWidgets(
        setupDashboardState([widget1, widget2]),
        onMoveWidgetsAction({
          widgets: [widget1],
          vector: { x: 1, y: 1 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1,
          y: 1,
        }),
        expect.objectContaining({
          x: 6,
          y: 6,
        }),
      ])
    );
  });

  it('does not shift widget when the vector is 0, 0', () => {
    const widget = MockWidgetFactory.getKpiWidget({ x: 0, y: 0, width: 5, height: 5 });

    expect(
      moveWidgets(
        setupDashboardState([widget]),
        onMoveWidgetsAction({
          widgets: [widget],
          vector: { x: 0, y: 0 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 0,
          y: 0,
        }),
      ])
    );
  });

  it('shifts only selected widgets when multiple widgets are on the dashboard', () => {
    const widget1 = MockWidgetFactory.getKpiWidget({ x: 0, y: 0, width: 5, height: 5 });
    const widget2 = MockWidgetFactory.getKpiWidget({ x: 6, y: 6, width: 5, height: 5 });
    const widget3 = MockWidgetFactory.getKpiWidget({ x: 14, y: 14, width: 5, height: 5 });

    expect(
      moveWidgets(
        setupDashboardState([widget1, widget2, widget3]),
        onMoveWidgetsAction({
          widgets: [widget1, widget2],
          vector: { x: 1, y: 1 },
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1,
          y: 1,
        }),
        expect.objectContaining({
          x: 7,
          y: 7,
        }),
        expect.objectContaining({
          x: 14,
          y: 14,
        }),
      ])
    );
  });

  it('snaps widgets to the grid when the move action is complete', () => {
    const widget1 = MockWidgetFactory.getKpiWidget({ x: 0, y: 0, width: 5, height: 5 });

    expect(
      moveWidgets(
        setupDashboardState([widget1]),
        onMoveWidgetsAction({
          widgets: [widget1],
          vector: { x: 1.1, y: 1.1 },
          complete: true,
        })
      ).dashboardConfiguration.widgets
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          x: 1,
          y: 1,
        }),
      ])
    );
  });
});
