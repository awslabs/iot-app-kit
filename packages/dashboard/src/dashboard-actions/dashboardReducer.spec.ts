import { dashboardReducer } from './dashboardReducer';
import { onMoveAction } from './actions';
import {
  DashboardReducerState,
  onResizeAction,
  ResizeActionInput,
  DashboardConfiguration,
  onDeleteAction,
  onCopyAction,
  onStretchToFitAction,
  onEditCellSizeAction,
  onEditWidthAction,
} from '../types';
import {
  MOCK_EMPTY_DASHBOARD,
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MockDashboardFactory,
  MockWidgetFactory,
} from '../testing/mocks';
import { move } from './move';
import { resize } from './resize';
import { deleteWidgets } from './delete';

describe('MOVE', () => {
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    expect(
      dashboardReducer(
        {
          dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
          selectedWidgetIds: [],
          numTimesCopyGroupHasBeenPasted: 0,
          copyGroup: [],
          stretchToFit: true,
          width: 1000,
          cellSize: 30,
        },
        onMoveAction({
          widgetIds: [],
          cellSize: 10,
          position: { x: 10, y: 10 },
          prevPosition: { x: 14, y: 10 },
        })
      )
    ).toEqual({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      selectedWidgetIds: [],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    });
  });
  it('moves a single widget', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };
    const movedDashboard: DashboardReducerState = state;
    movedDashboard.dashboardConfiguration = move({
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 14, y: 10 },
      dashboardConfiguration: state.dashboardConfiguration,
    });
    expect(
      dashboardReducer(
        state,
        onMoveAction({
          widgetIds: [MOCK_KPI_WIDGET.id],
          cellSize: 10,
          position: { x: 10, y: 10 },
          prevPosition: { x: 14, y: 10 },
        })
      )
    ).toEqual(movedDashboard);
  });
  it('moves a group of widgets', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };
    const movedDashboard: DashboardReducerState = state;
    movedDashboard.dashboardConfiguration = move({
      selectedWidgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 14, y: 10 },
      dashboardConfiguration: state.dashboardConfiguration,
    });
    expect(
      dashboardReducer(
        state,
        onMoveAction({
          widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
          cellSize: 10,
          position: { x: 10, y: 10 },
          prevPosition: { x: 14, y: 10 },
        })
      )
    ).toEqual(movedDashboard);
  });
});

describe('RESIZE', () => {
  it('resizes a single widget', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };
    const resizedDashboard: DashboardReducerState = state;
    const resizeAction: ResizeActionInput = {
      widgetIds: [MOCK_KPI_WIDGET.id],
      cellSize: 10,
      changeInPosition: { x: -10, y: -10 },
      anchor: 'top-left',
      dashboardConfiguration: state.dashboardConfiguration,
    };
    resizedDashboard.dashboardConfiguration = resize(resizeAction);
    expect(
      dashboardReducer(
        state,
        onResizeAction({
          widgetIds: [MOCK_KPI_WIDGET.id],
          cellSize: 10,
          changeInPosition: { x: -10, y: -10 },
          anchor: 'top-left',
          dashboardConfiguration: state.dashboardConfiguration,
        })
      )
    ).toEqual(resizedDashboard);
  });
  it('resizes a group of widgets', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };
    const resizedDashboard: DashboardReducerState = state;
    const resizeAction: ResizeActionInput = {
      widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      cellSize: 10,
      changeInPosition: { x: -10, y: -10 },
      anchor: 'top-left',
      dashboardConfiguration: state.dashboardConfiguration,
    };
    resizedDashboard.dashboardConfiguration = resize(resizeAction);
    expect(
      dashboardReducer(
        state,
        onResizeAction({
          widgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
          cellSize: 10,
          changeInPosition: { x: -10, y: -10 },
          anchor: 'top-left',
          dashboardConfiguration: state.dashboardConfiguration,
        })
      )
    ).toEqual(resizedDashboard);
  });
});

describe('DELETE', () => {
  it('deletes specified widgets ', () => {
    const WIDGET_2 = MockWidgetFactory.getKpiWidget();
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET, WIDGET_2] });
    const deletedDash: DashboardConfiguration = deleteWidgets({
      dashboardConfiguration,
      widgetIdsToDelete: [MOCK_KPI_WIDGET.id],
    });
    const state: DashboardReducerState = {
      dashboardConfiguration: dashboardConfiguration,
      selectedWidgetIds: [MOCK_KPI_WIDGET.id, MOCK_LINE_CHART_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };

    const deletedState: DashboardReducerState = state;
    deletedState.dashboardConfiguration = deletedDash;
    expect(
      dashboardReducer(
        state,
        onDeleteAction({
          widgetIds: [MOCK_KPI_WIDGET.id],
          widgets: [MOCK_KPI_WIDGET],
        })
      )
    ).toEqual(deletedState);
  });
});

describe('COPY', () => {
  it('copies selected widgets', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };

    const copiedState: DashboardReducerState = state;
    copiedState.copyGroup = [MOCK_KPI_WIDGET];
    expect(
      dashboardReducer(
        state,
        onCopyAction({
          copyGroup: [MOCK_KPI_WIDGET],
        })
      )
    ).toEqual(copiedState);
  });
});

describe('Stretch to fit', () => {
  it('changes stretch to fit status', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };

    const editedState: DashboardReducerState = state;
    editedState.stretchToFit = false;
    expect(dashboardReducer(state, onStretchToFitAction())).toEqual(editedState);
  });
});

describe('Edit Cell Size', () => {
  it('edits cell size', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };

    const editedState: DashboardReducerState = state;
    editedState.cellSize = 500;
    expect(
      dashboardReducer(
        state,
        onEditCellSizeAction({
          cellSize: 500,
        })
      )
    ).toEqual(editedState);
  });
});

describe('Edit Width', () => {
  it('edits width of dashboard', () => {
    const state: DashboardReducerState = {
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      selectedWidgetIds: [MOCK_KPI_WIDGET.id],
      numTimesCopyGroupHasBeenPasted: 0,
      copyGroup: [],
      stretchToFit: true,
      width: 1000,
      cellSize: 30,
    };

    const editedState: DashboardReducerState = state;
    editedState.width = 500;
    expect(
      dashboardReducer(
        state,
        onEditWidthAction({
          width: 500,
        })
      )
    ).toEqual(editedState);
  });
});
