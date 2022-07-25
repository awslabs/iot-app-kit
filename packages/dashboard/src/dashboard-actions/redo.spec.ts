import { MockWidgetFactory, MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../testing/mocks';
import {
  CreateAction,
  DashboardConfiguration,
  DashboardReducerState,
  DeleteAction,
  onDeleteAction,
  onCreateAction,
  onMoveAction,
  onResizeAction,
  ResizeAction,
  PasteAction,
  onPasteAction,
  onStretchToFitAction,
} from '../types';
import { redo } from './redo';
import { resize } from './resize';
import { getMovedDashboardConfiguration } from './move';
import { reverseResize } from './reverse-actions/reverseResize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseCreate } from './reverse-actions/reverseCreate';
import { paste } from './paste';
import { reversePaste } from './reverse-actions/reversePaste';
import { createWidget } from './createWidget';

const state: DashboardReducerState = {
  dashboardConfiguration: {
    widgets: [MOCK_KPI_WIDGET],
    viewport: { duration: '5m' },
  },
  selectedWidgetIds: [],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [],
  stretchToFit: true,
  width: 1000,
  cellSize: 10,
};

describe('MOVE', () => {
  const moveAction = onMoveAction({
    position: { x: 10, y: 10 },
    prevPosition: { x: 20, y: 30 },
    widgetIds: [MOCK_KPI_WIDGET.id],
    cellSize: 10,
  });
  it('returns the original input when redone twice', () => {
    expect(
      redo({
        dashAction: reverseMove(moveAction),
        dashboardState: redo({
          dashAction: moveAction,
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });

  it('returns no change when provided empty dashboard', () => {
    const emptyDashState: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };
    expect(
      redo({
        dashAction: moveAction,
        dashboardState: emptyDashState,
      })
    ).toEqual(emptyDashState);
  });

  it('reverses a single move', () => {
    const moveAction = onMoveAction({
      position: { x: MOCK_KPI_WIDGET.x, y: MOCK_KPI_WIDGET.y },
      prevPosition: { x: 50, y: 50 },
      widgetIds: ['mock-kpi-widget'],
      cellSize: 30,
    });
    if(moveAction.payload.prevPosition){
      const reversedDashboard: DashboardConfiguration = getMovedDashboardConfiguration({
        position: moveAction.payload.prevPosition,
        previousPosition: moveAction.payload.position,
        cellSize: moveAction.payload.cellSize,
        selectedWidgetIds: moveAction.payload.widgetIds,
        dashboardConfiguration: state.dashboardConfiguration,
      });
  
      expect(
        redo({
          dashAction: moveAction,
          dashboardState: state,
        }).dashboardConfiguration
      ).toEqual(reversedDashboard);
    }
    
  });
});

describe('RESIZE', () => {
  it('reverses a single resize', () => {
    const resizeAction: ResizeAction = onResizeAction({
      anchor: 'right',
      changeInPosition: { x: 10, y: 10 },
      widgetIds: [MOCK_KPI_WIDGET.id],
      cellSize: state.cellSize,
      dashboardConfiguration: state.dashboardConfiguration,
    });
    const reversedDashboard: DashboardConfiguration = resize({
      anchor: resizeAction.payload.anchor,
      changeInPosition: {
        x: resizeAction.payload.changeInPosition.x * -1,
        y: resizeAction.payload.changeInPosition.y * -1,
      },
      cellSize: resizeAction.payload.cellSize,
      widgetIds: resizeAction.payload.widgetIds,
      dashboardConfiguration: state.dashboardConfiguration,
    });

    expect(
      redo({
        dashAction: resizeAction,
        dashboardState: state,
      }).dashboardConfiguration
    ).toEqual(reversedDashboard);
  });

  it('returns original state reversed twice', () => {
    const resizeAction: ResizeAction = onResizeAction({
      anchor: 'right',
      changeInPosition: { x: 10, y: 10 },
      widgetIds: [MOCK_KPI_WIDGET.id],
      cellSize: state.cellSize,
      dashboardConfiguration: state.dashboardConfiguration
    });

    expect(
      redo({
        dashAction: reverseResize(resizeAction),
        dashboardState: redo({
          dashAction: resizeAction,
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });
});

describe('CREATE', () => {
  it('recreates widget', () => {
    const createAction: CreateAction = onCreateAction({
      dashboardConfiguration: state.dashboardConfiguration,
      widgets: [MOCK_LINE_CHART_WIDGET],
    });
    const createState: DashboardReducerState = state;
    createState.dashboardConfiguration = createWidget({
      dashboardConfiguration: state.dashboardConfiguration,
      widgets: createAction.payload.widgets,
    });
    expect(
      redo({
        dashAction: createAction,
        dashboardState: state,
      })
    ).toEqual(createState);
  });

  it('returns original state when reversed twice', () => {
    const createAction: CreateAction = onCreateAction({
      dashboardConfiguration: state.dashboardConfiguration,
      widgets: [MOCK_KPI_WIDGET],
    });

    expect(
      redo({
        dashAction: reverseCreate(createAction),
        dashboardState: redo({
          dashAction: createAction,
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });
});

describe('DELETE', () => {
  it('creates widget', () => {
    const deleteAction: DeleteAction = onDeleteAction({
      widgetIds: [MOCK_KPI_WIDGET.id],
      widgets: [MOCK_KPI_WIDGET],
    });

    expect(
      redo({
        dashAction: deleteAction,
        dashboardState: state,
      })
    ).toEqual(state);
  });

  it('returns original state when reversed twice', () => {
    const createAction: CreateAction = onCreateAction({
      dashboardConfiguration: state.dashboardConfiguration,
      widgets: [MOCK_KPI_WIDGET],
    });

    expect(
      redo({
        dashAction: reverseCreate(createAction),
        dashboardState: redo({
          dashAction: createAction,
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });
});

describe('PASTE', () => {
  const pasteState: DashboardReducerState = {
    dashboardConfiguration: {
      widgets: [MOCK_KPI_WIDGET],
      viewport: { duration: '5m' },
    },
    selectedWidgetIds: [],
    numTimesCopyGroupHasBeenPasted: 0,
    copyGroup: [MOCK_KPI_WIDGET],
    stretchToFit: true,
    width: 1000,
    cellSize: 10,
  };
  pasteState.dashboardConfiguration = paste({
    dashboardConfiguration: pasteState.dashboardConfiguration,
    copyGroup: state.copyGroup,
    numTimesCopyGroupHasBeenPasted: state.numTimesCopyGroupHasBeenPasted,
  });
  it('creates the deleted, pasted widget', () => {
    const pasteAction: PasteAction = onPasteAction({
      numTimesPasted: pasteState.numTimesCopyGroupHasBeenPasted,
      copyGroup: pasteState.copyGroup,
    });

    expect(
      redo({
        dashAction: pasteAction,
        dashboardState: pasteState,
      })
    ).toEqual(pasteState);
  });

  it('returns original state when reversed twice', () => {
    const pasteAction: PasteAction = onPasteAction({
      numTimesPasted: pasteState.numTimesCopyGroupHasBeenPasted,
      copyGroup: pasteState.copyGroup,
    });

    const redonePasteState = pasteState;

    redonePasteState.dashboardConfiguration = paste({
      dashboardConfiguration: pasteState.dashboardConfiguration,
      copyGroup: redonePasteState.copyGroup,
      numTimesCopyGroupHasBeenPasted: redonePasteState.numTimesCopyGroupHasBeenPasted,
    });

    expect(
      redo({
        dashAction: reversePaste(pasteState.dashboardConfiguration),
        dashboardState: redo({
          dashAction: pasteAction,
          dashboardState: pasteState,
        }),
      })
    ).toEqual(redonePasteState);
  });
});

describe('Strech To Fit', () => {
  it('toggles stretch to fit', () => {
    const stretchToFitState: DashboardReducerState = state;
    stretchToFitState.stretchToFit = false;
    expect(
      redo({
        dashAction: onStretchToFitAction(),
        dashboardState: state,
      })
    ).toEqual(stretchToFitState);
  });

  it('returns original state when reversed twice', () => {
    expect(
      redo({
        dashAction: onStretchToFitAction(),
        dashboardState: redo({
          dashAction: onStretchToFitAction(),
          dashboardState: state,
        }),
      })
    ).toEqual(state);
  });
});
