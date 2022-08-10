import { MOCK_KPI_WIDGET, dashboardConfig, MOCK_EMPTY_DASHBOARD, MOCK_LINE_CHART_WIDGET } from '../testing/mocks';
import {
  onMoveAction,
  onResizeAction,
  ResizeAction,
  onPasteAction,
  onUpdateAction,
  onCreateAction,
  onDeleteAction,
} from '../dashboard-actions/actions';
import { DashboardState } from '../types';
import { redo } from './redo';
import { reverseResize } from './reverse-actions/reverseResize';
import { move } from './move';
import { reverseMove } from './reverse-actions/reverseMove';
import { resize } from './resize';
import { createWidget } from './createWidget';
import { deleteWidgets } from './delete';

const state: DashboardState = {
  dashboardConfiguration: {
    widgets: [MOCK_KPI_WIDGET],
    viewport: { duration: '5m' },
  },
  selectedWidgetIds: [MOCK_KPI_WIDGET.id],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [MOCK_KPI_WIDGET],
  stretchToFit: true,
  width: 1000,
  cellSize: 10,
  undoQueue: [],
  redoQueue: [],
  intermediateDashboardConfiguration: undefined,
};

describe('MOVE', () => {
  const moveAction = onMoveAction({
    position: { x: 10, y: 10 },
    prevPosition: { x: 20, y: 20 },
    isActionComplete: true,
  });

  it('returns no change when provided empty dashboard', () => {
    expect(
      redo({
        dashboardAction: moveAction,
        dashboardState: { ...state, dashboardConfiguration: MOCK_EMPTY_DASHBOARD },
      })
    ).toEqual({ ...state, dashboardConfiguration: MOCK_EMPTY_DASHBOARD });
  });

  it('reverses a single move', () => {
    expect(
      redo({
        dashboardAction: reverseMove(moveAction),
        dashboardState: { ...state },
      }).dashboardConfiguration
    ).toEqual(
      move({
        position: { x: 20, y: 20 },
        previousPosition: { x: 10, y: 10 },
        selectedWidgetIds: [MOCK_KPI_WIDGET.id],
        cellSize: 10,
        dashboardConfiguration: state.dashboardConfiguration,
      })
    );
  });

  it('returns original state reversed twice', () => {
    expect(
      redo({
        dashboardAction: reverseMove(moveAction),
        dashboardState: redo({
          dashboardAction: moveAction,
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });
});

describe('RESIZE', () => {
  const resizeAction: ResizeAction = onResizeAction({
    anchor: 'right',
    changeInPosition: { x: 10, y: 10 },
    isActionComplete: true,
  });

  it('reverses a single resize', () => {
    expect(
      redo({
        dashboardAction: reverseResize(resizeAction),
        dashboardState: { ...state },
      }).dashboardConfiguration
    ).toEqual(
      resize({
        anchor: 'right',
        dashboardConfiguration: { ...state.dashboardConfiguration },
        changeInPosition: { x: -10, y: -10 },
        widgetIds: [MOCK_KPI_WIDGET.id],
        cellSize: 10,
      })
    );
  });

  it('returns original state reversed twice', () => {
    expect(
      redo({
        dashboardAction: reverseResize(resizeAction),
        dashboardState: redo({
          dashboardAction: resizeAction,
          dashboardState: { ...state },
        }),
      })
    ).toEqual({ ...state });
  });
});

describe('PASTE', () => {
  it('pastes selected widgets', () => {
    const dashboardConfiguration = { ...dashboardConfig };

    expect(
      redo({
        dashboardAction: onPasteAction(),
        dashboardState: { ...state },
      }).dashboardConfiguration
    ).toEqual({
      ...dashboardConfiguration,
      widgets: [
        MOCK_KPI_WIDGET,
        { ...MOCK_KPI_WIDGET, id: expect.any(String), x: MOCK_KPI_WIDGET.x + 1, y: MOCK_KPI_WIDGET.y + 1 },
      ],
    });
  });
});

describe('CREATE', () => {
  it('recreates widget', () => {
    expect(
      redo({
        dashboardAction: onCreateAction({ widgets: [MOCK_KPI_WIDGET] }),
        dashboardState: { ...state, dashboardConfiguration: MOCK_EMPTY_DASHBOARD },
      }).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('creates new widget on non-empty dashboard', () => {
    expect(
      redo({
        dashboardAction: onCreateAction({ widgets: [MOCK_KPI_WIDGET] }),
        dashboardState: { ...state, dashboardConfiguration: dashboardConfig },
      }).dashboardConfiguration
    ).toEqual(
      createWidget({
        dashboardConfiguration: dashboardConfig,
        widgets: [MOCK_KPI_WIDGET],
      })
    );
  });
});

describe('DELETE', () => {
  it('deletes widget ', () => {
    expect(
      redo({
        dashboardAction: onDeleteAction({ widgets: [MOCK_KPI_WIDGET] }),
        dashboardState: state,
      }).dashboardConfiguration
    ).toEqual(
      {
        ...state,
        dashboardConfiguration: deleteWidgets({
          dashboardConfiguration: state.dashboardConfiguration,
          widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
        }),
      }.dashboardConfiguration
    );
  });

  it('deletes group of widgets ', () => {
    expect(
      redo({
        dashboardAction: onDeleteAction({ widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET] }),
        dashboardState: {
          ...state,
          dashboardConfiguration: { widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET], viewport: { duration: '5m' } },
        },
      }).dashboardConfiguration.widgets
    ).toEqual(MOCK_EMPTY_DASHBOARD.widgets);
  });
});

describe('UPDATE', () => {
  it('restores stretch to fit', () => {
    expect(
      redo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { stretchToFit: true },
          previousField: { stretchToFit: false },
        }),
        dashboardState: state,
      }).stretchToFit
    ).toEqual(true);
  });

  it('restores width', () => {
    expect(
      redo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { width: 1000 },
          previousField: { width: 500 },
        }),
        dashboardState: state,
      }).width
    ).toEqual(1000);
  });

  it('restores cell size', () => {
    expect(
      redo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { cellSize: 30 },
          previousField: { cellSize: 10 },
        }),
        dashboardState: state,
      }).cellSize
    ).toEqual(30);
  });
});
