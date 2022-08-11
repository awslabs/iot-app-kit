import { Reducer } from 'redux';
import { DashboardState } from '../types';
import { DashboardAction, onMoveAction, onPasteAction, onResizeAction } from './actions';
import { move } from './move';
import { resize } from './resize';
import { deleteWidgets } from './delete';
import { paste } from './paste';
import { undo } from './undo';
import { redo } from './redo';
import { updateDashboardState } from './updateDashboardState';
import { dashboardConfig } from './../testing/mocks';
import { createWidget } from './createWidget';

const initialState: DashboardState = {
  dashboardConfiguration: dashboardConfig,
  intermediateDashboardConfiguration: undefined,
  selectedWidgetIds: [],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [],
  stretchToFit: false,
  width: 1000,
  cellSize: 10,
  undoQueue: [],
  redoQueue: [],
  previousPosition: undefined,
};

export const dashboardReducer: Reducer<DashboardState, DashboardAction> = (
  state: DashboardState = initialState,
  action: DashboardAction
): DashboardState => {
  let actionToRevert: DashboardAction | undefined = onPasteAction();
  switch (action.type) {
    case 'MOVE':
      if (!action.payload.isActionComplete) {
        return {
          ...state,
          previousPosition: action.payload.position,
          intermediateDashboardConfiguration: move({
            dashboardConfiguration: state.intermediateDashboardConfiguration || state.dashboardConfiguration,
            position: action.payload.position,
            previousPosition: state.previousPosition,
            selectedWidgetIds: state.selectedWidgetIds,
            cellSize: state.cellSize,
          }),
        };
      }
      return {
        ...state,
        dashboardConfiguration: move({
          dashboardConfiguration: state.dashboardConfiguration,
          position: action.payload.position,
          previousPosition: action.payload.prevPosition,
          selectedWidgetIds: state.selectedWidgetIds,
          cellSize: state.cellSize,
        }),
        intermediateDashboardConfiguration: undefined,
        undoQueue: state.undoQueue.concat(
          onMoveAction({
            position: action.payload.position,
            widgetIds: state.selectedWidgetIds,
            isActionComplete: true,
            prevPosition: action.payload.prevPosition,
          })
        ),
        redoQueue: [],
        previousPosition: undefined,
      };

    case 'RESIZE':
      if (!action.payload.isActionComplete) {
        return {
          ...state,
          intermediateDashboardConfiguration: resize({
            anchor: action.payload.anchor,
            dashboardConfiguration: state.dashboardConfiguration,
            widgetIds: state.selectedWidgetIds,
            changeInPosition: action.payload.changeInPosition,
            cellSize: state.cellSize,
          }),
        };
      }
      return {
        ...state,
        intermediateDashboardConfiguration: undefined,
        dashboardConfiguration: resize({
          anchor: action.payload.anchor,
          dashboardConfiguration: state.dashboardConfiguration,
          widgetIds: state.selectedWidgetIds,
          changeInPosition: action.payload.changeInPosition,
          cellSize: state.cellSize,
        }),
        undoQueue: state.undoQueue.concat(
          onResizeAction({
            anchor: action.payload.anchor,
            changeInPosition: action.payload.changeInPosition,
            isActionComplete: action.payload.isActionComplete,
            widgetIds: state.selectedWidgetIds,
          })
        ),
        redoQueue: [],
      };

    case 'DELETE':
      return {
        ...state,
        dashboardConfiguration: deleteWidgets({
          dashboardConfiguration: state.dashboardConfiguration,
          widgetIdsToDelete: state.selectedWidgetIds,
        }),
        undoQueue: state.undoQueue.concat(action),
        redoQueue: [],
      };

    case 'PASTE':
      return {
        ...state,
        numTimesCopyGroupHasBeenPasted: state.numTimesCopyGroupHasBeenPasted + 1,
        dashboardConfiguration: paste({
          dashboardConfiguration: state.dashboardConfiguration,
          copyGroup: state.copyGroup,
          numTimesCopyGroupHasBeenPasted: state.numTimesCopyGroupHasBeenPasted,
        }),
        undoQueue: state.undoQueue.concat(action),
        redoQueue: [],
      };

    case 'CREATE':
      return {
        ...state,
        dashboardConfiguration: createWidget({
          dashboardConfiguration: state.dashboardConfiguration,
          widgets: action.payload.widgets,
        }),
        undoQueue: state.undoQueue.concat(action),
        redoQueue: [],
      };

    case 'UNDO':
      actionToRevert = state.undoQueue.pop();
      if (actionToRevert) {
        return {
          ...(state = undo({
            dashboardAction: actionToRevert,
            dashboardState: state,
          })),
          redoQueue: state.redoQueue.concat(actionToRevert),
        };
      }
      return state;

    case 'REDO':
      actionToRevert = state.redoQueue.pop();
      if (actionToRevert) {
        return {
          ...(state = redo({
            dashboardAction: actionToRevert,
            dashboardState: state,
          })),
          undoQueue: state.undoQueue.concat(actionToRevert),
        };
      }
      return state;

    case 'COPY':
      return {
        ...state,
        numTimesCopyGroupHasBeenPasted: 0,
        copyGroup: state.dashboardConfiguration.widgets.filter(({ id }) => state.selectedWidgetIds.includes(id)),
      };

    case 'UPDATE':
      return updateDashboardState(state, {
        ...action.payload.fieldsToUpdate,
        undoQueue: state.undoQueue.concat(action),
        redoQueue: [],
      });

    case 'SELECT':
      return {
        ...state,
        selectedWidgetIds: action.payload.widgetIds,
      };

    default:
      return state;
  }
};
