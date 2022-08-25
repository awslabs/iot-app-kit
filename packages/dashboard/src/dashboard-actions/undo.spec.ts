import { dashboardConfig, MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../testing/mocks';
import {
  onDeleteAction,
  onCreateAction,
  onMoveAction,
  onResizeAction,
  ResizeAction,
  onPasteAction,
  onUpdateAction,
} from '../dashboard-actions/actions';
import { DashboardConfiguration, DashboardState, Position } from '../types';
import { undo } from './undo';
import { resize } from './resize';
import { move } from './move';
import { createWidget } from './createWidget';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';
import { reverseCreate } from './reverse-actions/reverseCreate';
import { reverseDelete } from './reverse-actions/reverseDelete';
import { dashboardReducer } from './dashboardReducer';
import { trimWidgetPosition } from '../components/iot-dashboard-grid/trimWidgetPosition';

const state: DashboardState = {
  dashboardConfiguration: {
    widgets: [MOCK_KPI_WIDGET],
    viewport: { duration: '5m' },
  },
  intermediateDashboardConfiguration: undefined,
  selectedWidgetIds: [MOCK_KPI_WIDGET.id],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [MOCK_KPI_WIDGET],
  stretchToFit: true,
  width: 1000,
  cellSize: 10,
  undoQueue: [],
  redoQueue: [],
  previousPosition: undefined,
};

describe('MOVE', () => {
  const moveAction = onMoveAction({
    position: { x: 20, y: 30 },
    prevPosition: { x: 20, y: 20 },
    widgetIds: ['mock-kpi-widget'],
    isActionComplete: true,
  });

  it('reverses a single move', () => {
    moveAction.payload.prevPosition as Position;
    const reversedDashboard: DashboardConfiguration = move({
      position: moveAction.payload.prevPosition,
      previousPosition: moveAction.payload.position,
      cellSize: state.cellSize,
      selectedWidgetIds: moveAction.payload.widgetIds,
      dashboardConfiguration: state.dashboardConfiguration,
    });

    expect(
      undo({
        dashboardAction: moveAction,
        dashboardState: { ...state },
      }).dashboardConfiguration
    ).toEqual(reversedDashboard);
  });

  it('returns original state when reversed twice', () => {
    expect(
      undo({
        dashboardAction: reverseMove(moveAction),
        dashboardState: undo({
          dashboardAction: moveAction,
          dashboardState: { ...state },
        }),
      }).dashboardConfiguration
    ).toEqual({ ...state }.dashboardConfiguration);
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
      undo({
        dashboardAction: resizeAction,
        dashboardState: state,
      }).dashboardConfiguration
    ).toEqual(
      resize({
        anchor: resizeAction.payload.anchor,
        changeInPosition: {
          x: resizeAction.payload.changeInPosition.x * -1,
          y: resizeAction.payload.changeInPosition.y * -1,
        },
        cellSize: state.cellSize,
        widgetIds: state.selectedWidgetIds,
        dashboardConfiguration: state.dashboardConfiguration,
      })
    );
  });

  it('returns original state when reversed twice', () => {
    expect(
      undo({
        dashboardAction: reverseResize(resizeAction),
        dashboardState: undo({
          dashboardAction: resizeAction,
          dashboardState: { ...state },
        }),
      }).dashboardConfiguration
    ).toEqual({ ...state }.dashboardConfiguration);
  });
});

describe('CREATE', () => {
  it('removes widget', () => {
    expect(
      undo({
        dashboardAction: onCreateAction({
          widgets: [MOCK_KPI_WIDGET],
        }),
        dashboardState: { ...state },
      }).dashboardConfiguration.widgets
    ).toEqual([]);
  });

  it('returns original state when reversed twice', () => {
    expect(
      undo({
        dashboardAction: reverseCreate(
          onCreateAction({
            widgets: [MOCK_KPI_WIDGET],
          })
        ),
        dashboardState: undo({
          dashboardAction: onCreateAction({
            widgets: [MOCK_KPI_WIDGET],
          }),
          dashboardState: { ...state },
        }),
      }).dashboardConfiguration
    ).toEqual(dashboardConfig);
  });
});

describe('DELETE', () => {
  it('creates widget', () => {
    expect(
      undo({
        dashboardAction: onDeleteAction({
          widgets: [MOCK_LINE_CHART_WIDGET],
        }),
        dashboardState: state,
      }).dashboardConfiguration
    ).toEqual(
      createWidget({
        widgets: [MOCK_LINE_CHART_WIDGET],
        dashboardConfiguration: state.dashboardConfiguration,
      })
    );
  });

  it('returns original state when reversed twice', () => {
    expect(
      undo({
        dashboardAction: reverseDelete(
          onDeleteAction({
            widgets: [MOCK_LINE_CHART_WIDGET],
          })
        ),
        dashboardState: undo({
          dashboardAction: onDeleteAction({
            widgets: [MOCK_LINE_CHART_WIDGET],
          }),
          dashboardState: { ...state },
        }),
      }).dashboardConfiguration
    ).toEqual({ ...state }.dashboardConfiguration);
  });
});

describe('PASTE', () => {
  it('removes pasted widget', () => {
    expect(
      undo({
        dashboardAction: onPasteAction(),
        dashboardState: { ...state, numTimesCopyGroupHasBeenPasted: 1 },
      }).dashboardConfiguration
    ).toEqual(MOCK_EMPTY_DASHBOARD);
  });
});

describe('UPDATE', () => {
  it('restores stretch to fit', () => {
    expect(
      undo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { stretchToFit: true },
          previousField: { stretchToFit: false },
        }),
        dashboardState: state,
      }).stretchToFit
    ).toEqual(false);
  });

  it('restores width', () => {
    expect(
      undo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { width: 1000 },
          previousField: { width: 500 },
        }),
        dashboardState: state,
      }).width
    ).toEqual(500);
  });

  it('restores cell size', () => {
    expect(
      undo({
        dashboardAction: onUpdateAction({
          fieldsToUpdate: { cellSize: 30 },
          previousField: { cellSize: 10 },
        }),
        dashboardState: state,
      }).cellSize
    ).toEqual(10);
  });
});

describe('MULTIPLE ACTIONS', () => {
  it('undoes a move and create action', () => {
    const undoState = dashboardReducer(
      { ...state },
      onMoveAction({
        position: { x: 10, y: 10 },
        prevPosition: { x: 2, y: 2 },
        isActionComplete: true,
      })
    );

    const newUndoState = dashboardReducer({ ...undoState }, onCreateAction({ widgets: [MOCK_LINE_CHART_WIDGET] }));

    expect(
      undo({
        dashboardAction: undoState.undoQueue.pop(),
        dashboardState: undo({
          dashboardState: newUndoState,
          dashboardAction: newUndoState.undoQueue.pop(),
        }),
      }).dashboardConfiguration.widgets.map(trimWidgetPosition)
    ).toEqual({ ...state }.dashboardConfiguration.widgets);
  });

  it('it undoes a resize and a create action', () => {
    const undoState = dashboardReducer(
      { ...state },
      onResizeAction({
        isActionComplete: true,
        anchor: 'bottom-right',
        changeInPosition: { x: 20, y: 20 },
      })
    );

    const newUndoState = dashboardReducer({ ...undoState }, onCreateAction({ widgets: [MOCK_LINE_CHART_WIDGET] }));

    expect(
      undo({
        dashboardAction: undoState.undoQueue.pop(),
        dashboardState: undo({
          dashboardState: newUndoState,
          dashboardAction: newUndoState.undoQueue.pop(),
        }),
      }).dashboardConfiguration.widgets.map(trimWidgetPosition)
    ).toEqual({ ...state }.dashboardConfiguration.widgets);
  });
});
