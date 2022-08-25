import { dashboardReducer } from './dashboardReducer';
import { onCreateAction, onMoveAction, onPasteAction, onRedoAction, onResizeAction, onUndoAction } from './actions';
import { DashboardState } from '../types';
import { onDeleteAction, onCopyAction, onUpdateAction } from '../dashboard-actions/actions';
import { MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, dashboardConfig, MOCK_LINE_CHART_WIDGET } from '../testing/mocks';
import { move } from './move';
import { deleteWidgets } from './delete';
import { resize } from './resize';
import { trimWidgetPosition } from '../components/iot-dashboard-grid/trimWidgetPosition';
import { createWidget } from './createWidget';
import { paste } from './paste';

const state: DashboardState = {
  dashboardConfiguration: dashboardConfig,
  selectedWidgetIds: [MOCK_KPI_WIDGET.id],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [MOCK_KPI_WIDGET],
  stretchToFit: true,
  width: 1000,
  cellSize: 30,
  intermediateDashboardConfiguration: undefined,
  undoQueue: [],
  redoQueue: [],
  previousPosition: undefined,
};

describe('MOVE', () => {
  const moveActionInput = {
    widgetIds: [MOCK_KPI_WIDGET],
    position: { x: 10, y: 10 },
    prevPosition: { x: 20, y: 20 },
    isActionComplete: true,
  };
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    expect(
      dashboardReducer(
        {
          dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
          intermediateDashboardConfiguration: undefined,
          selectedWidgetIds: [],
          numTimesCopyGroupHasBeenPasted: 0,
          copyGroup: [],
          stretchToFit: true,
          width: 1000,
          cellSize: 10,
          undoQueue: [],
          redoQueue: [],
          previousPosition: undefined,
        },
        onMoveAction(moveActionInput)
      ).dashboardConfiguration
    ).toEqual({
      viewport: { duration: '5m' },
      widgets: [],
    });
  });

  it('moves a single widget', () => {
    const movedDashboard = move({
      cellSize: 30,
      position: { x: 10, y: 10 },
      prevPosition: { x: 20, y: 20 },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      isActionComplete: true,
      dashboardConfiguration: dashboardConfig,
    });

    expect(
      dashboardReducer(state, onMoveAction(moveActionInput)).dashboardConfiguration.widgets.map(trimWidgetPosition)
    ).toEqual(movedDashboard.widgets.map(trimWidgetPosition));
  });
});

describe('RESIZE', () => {
  const resizeActionInput = {
    anchor: 'bottom-right',
    changeInPosition: { x: 10, y: 10 },
    cellSize: state.cellSize,
  };
  it('resizes selected widget', () => {
    expect(dashboardReducer({ ...state }, onResizeAction(resizeActionInput)).dashboardConfiguration.widgets).toEqual(
      resize({
        anchor: 'bottom-right',
        changeInPosition: { x: 10, y: 10 },
        widgetIds: [MOCK_KPI_WIDGET.id],
        cellSize: state.cellSize,
        dashboardConfiguration: dashboardConfig,
      }).widgets.map(trimWidgetPosition)
    );
  });

  it('resizes a group of widgets', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          dashboardConfiguration: { widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET], viewport: { duration: '5m' } },
          selectedWidgetIds: [MOCK_LINE_CHART_WIDGET.id, MOCK_KPI_WIDGET.id],
        },
        onResizeAction(resizeActionInput)
      ).dashboardConfiguration.widgets
    ).toEqual(
      resize({
        anchor: 'bottom-right',
        changeInPosition: { x: 10, y: 10 },
        widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
        cellSize: state.cellSize,
        dashboardConfiguration: { widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET], viewport: { duration: '5m' } },
      }).widgets.map(trimWidgetPosition)
    );
  });
});

describe('COPY', () => {
  it('copies selected widget', () => {
    expect(dashboardReducer({ ...state }, onCopyAction()).copyGroup).toEqual([MOCK_KPI_WIDGET]);
  });

  it('copies selected group of widgets', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          dashboardConfiguration: { widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET], viewport: { duration: '5m' } },
          selectedWidgetIds: [MOCK_LINE_CHART_WIDGET.id, MOCK_KPI_WIDGET.id],
        },
        onCopyAction()
      ).copyGroup
    ).toEqual([MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET]);
  });
});

describe('DELETE', () => {
  it('deletes widget ', () => {
    const deletedDash = deleteWidgets({
      dashboardConfiguration: state.dashboardConfiguration,
      widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
    });

    expect(
      dashboardReducer({ ...state }, onDeleteAction({ widgets: [MOCK_KPI_WIDGET] })).dashboardConfiguration
    ).toEqual(deletedDash);
  });

  it('deletes group of widgets ', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          dashboardConfiguration: { widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET], viewport: { duration: '5m' } },
          selectedWidgetIds: [MOCK_LINE_CHART_WIDGET.id, MOCK_KPI_WIDGET.id],
        },
        onDeleteAction({ widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET] })
      ).dashboardConfiguration.widgets
    ).toEqual(MOCK_EMPTY_DASHBOARD.widgets);
  });
});

describe('UPDATE', () => {
  it('edits cell size', () => {
    expect(
      dashboardReducer(
        state,
        onUpdateAction({
          fieldsToUpdate: { cellSize: 500 },
          previousField: { cellSize: 30 },
        })
      ).cellSize
    ).toEqual(500);
  });

  it('edits width of dashboard', () => {
    expect(
      dashboardReducer(
        state,
        onUpdateAction({
          fieldsToUpdate: { width: 500 },
          previousField: { width: 1000 },
        })
      ).width
    ).toEqual(500);
  });

  it('toggles stretch to fit', () => {
    expect(
      dashboardReducer(
        state,
        onUpdateAction({
          fieldsToUpdate: { stretchToFit: true },
          previousField: { stretchToFit: false },
        })
      ).stretchToFit
    ).toEqual(true);
  });
});

describe('PASTE', () => {
  it('pastes selected widgets', () => {
    const pasteState = { ...state };
    pasteState.dashboardConfiguration.widgets = [MOCK_KPI_WIDGET];
    pasteState.copyGroup = [MOCK_KPI_WIDGET];
    expect(dashboardReducer(pasteState, onPasteAction()).dashboardConfiguration).toEqual({
      ...dashboardConfig,
      widgets: [
        MOCK_KPI_WIDGET,
        { ...MOCK_KPI_WIDGET, id: expect.any(String), x: MOCK_KPI_WIDGET.x + 1, y: MOCK_KPI_WIDGET.y + 1 },
      ],
    });
  });
});

describe('CREATE', () => {
  const emptyState = { ...state };
  emptyState.dashboardConfiguration = MOCK_EMPTY_DASHBOARD;
  it('creates new widget on empty dashboard', () => {
    expect(
      dashboardReducer(emptyState, onCreateAction({ widgets: [MOCK_KPI_WIDGET] })).dashboardConfiguration.widgets
    ).toEqual([MOCK_KPI_WIDGET]);
  });

  it('creates new widget on non-empty dashboard', () => {
    emptyState.dashboardConfiguration = dashboardConfig;
    expect(dashboardReducer(emptyState, onCreateAction({ widgets: [MOCK_KPI_WIDGET] })).dashboardConfiguration).toEqual(
      createWidget({
        dashboardConfiguration: emptyState.dashboardConfiguration,
        widgets: [MOCK_KPI_WIDGET],
      })
    );
  });
});

describe('UNDO', () => {
  it('undoes a move action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          undoQueue: [
            onMoveAction({
              widgetIds: [MOCK_KPI_WIDGET.id],
              position: { x: 10, y: 10 },
              prevPosition: { x: 20, y: 20 },
              isActionComplete: true,
            }),
          ],
        },
        onUndoAction()
      ).dashboardConfiguration.widgets.map(trimWidgetPosition)
    ).toEqual(
      move({
        position: { x: 20, y: 20 },
        previousPosition: { x: 10, y: 10 },
        dashboardConfiguration: state.dashboardConfiguration,
        cellSize: state.cellSize,
        selectedWidgetIds: state.selectedWidgetIds,
      }).widgets.map(trimWidgetPosition)
    );
  });

  it('undoes a resize action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          undoQueue: [
            onResizeAction({
              anchor: 'right',
              changeInPosition: { x: 20, y: 20 },
              isActionComplete: true,
            }),
          ],
        },
        onUndoAction()
      ).dashboardConfiguration
    ).toEqual(
      resize({
        anchor: 'right',
        changeInPosition: { x: -20, y: -20 },
        dashboardConfiguration: state.dashboardConfiguration,
        cellSize: state.cellSize,
        widgetIds: state.selectedWidgetIds,
      })
    );
  });

  it('undoes a paste action', () => {
    expect(dashboardReducer({ ...state, undoQueue: [onPasteAction()] }, onUndoAction()).dashboardConfiguration).toEqual(
      deleteWidgets({
        widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
        dashboardConfiguration: state.dashboardConfiguration,
      })
    );
  });

  it('undoes a delete action', () => {
    expect(
      dashboardReducer({ ...state, undoQueue: [onDeleteAction({ widgets: [MOCK_KPI_WIDGET] })] }, onUndoAction())
        .dashboardConfiguration
    ).toEqual(
      createWidget({
        dashboardConfiguration: state.dashboardConfiguration,
        widgets: [MOCK_KPI_WIDGET],
      })
    );
  });

  it('undoes a create action', () => {
    expect(
      dashboardReducer({ ...state, undoQueue: [onCreateAction({ widgets: [MOCK_KPI_WIDGET] })] }, onUndoAction())
        .dashboardConfiguration
    ).toEqual(
      deleteWidgets({
        dashboardConfiguration: state.dashboardConfiguration,
        widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
      })
    );
  });

  it('undoes an update action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          undoQueue: [
            onUpdateAction({
              fieldsToUpdate: { cellSize: 10 },
              previousField: { cellSize: 30 },
            }),
          ],
        },
        onUndoAction()
      ).cellSize
    ).toEqual(30);
  });
});

describe('REDO', () => {
  it('redoes a move action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          redoQueue: [
            onMoveAction({
              position: { x: 10, y: 10 },
              prevPosition: { x: 20, y: 20 },
              isActionComplete: true,
            }),
          ],
        },
        onRedoAction()
      ).dashboardConfiguration.widgets.map(trimWidgetPosition)
    ).toEqual(
      move({
        position: { x: 10, y: 10 },
        previousPosition: { x: 20, y: 20 },
        dashboardConfiguration: state.dashboardConfiguration,
        cellSize: state.cellSize,
        selectedWidgetIds: state.selectedWidgetIds,
      }).widgets.map(trimWidgetPosition)
    );
  });

  it('redoes a resize action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          redoQueue: [
            onResizeAction({
              anchor: 'right',
              changeInPosition: { x: 20, y: 20 },
              isActionComplete: true,
            }),
          ],
        },
        onRedoAction()
      ).dashboardConfiguration
    ).toEqual(
      resize({
        anchor: 'right',
        changeInPosition: { x: 20, y: 20 },
        dashboardConfiguration: state.dashboardConfiguration,
        cellSize: state.cellSize,
        widgetIds: state.selectedWidgetIds,
      })
    );
  });

  it('redoes a paste action', () => {
    expect(
      dashboardReducer({ ...state, redoQueue: [onPasteAction()] }, onRedoAction()).dashboardConfiguration.widgets.length
    ).toEqual(
      paste({
        dashboardConfiguration: state.dashboardConfiguration,
        copyGroup: [MOCK_KPI_WIDGET],
        numTimesCopyGroupHasBeenPasted: 0,
      }).widgets.length
    );
  });

  it('redoes a delete action', () => {
    expect(
      dashboardReducer({ ...state, redoQueue: [onDeleteAction({ widgets: [MOCK_KPI_WIDGET] })] }, onRedoAction())
        .dashboardConfiguration
    ).toEqual(
      deleteWidgets({
        dashboardConfiguration: state.dashboardConfiguration,
        widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
      })
    );
  });

  it('redoes a create action', () => {
    expect(
      dashboardReducer({ ...state, redoQueue: [onCreateAction({ widgets: [MOCK_KPI_WIDGET] })] }, onRedoAction())
        .dashboardConfiguration
    ).toEqual(
      createWidget({
        dashboardConfiguration: state.dashboardConfiguration,
        widgets: [MOCK_KPI_WIDGET],
      })
    );
  });

  it('redoes an update action', () => {
    expect(
      dashboardReducer(
        {
          ...state,
          redoQueue: [
            onUpdateAction({
              fieldsToUpdate: { cellSize: 10 },
              previousField: { cellSize: 30 },
            }),
          ],
        },
        onRedoAction()
      ).cellSize
    ).toEqual(10);
  });
});
