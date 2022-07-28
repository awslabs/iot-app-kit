import { Reducer } from 'redux';
import { DashboardReducerState, DashboardAction } from '../types';
import { move } from './move';
import { resize } from './resize';
import { trimWidgetPosition } from '../components/iot-dashboard/trimWidgetPosition';
import { deleteWidgets } from './delete';
import { paste } from './paste';
import { undo } from './undo';
import { redo } from './redo';
import { dashboardConfig } from './../testing/mocks';
import { createWidget } from './createWidget';

const initialState: DashboardReducerState = {
  dashboardConfiguration: dashboardConfig,
  selectedWidgetIds: [],
  numTimesCopyGroupHasBeenPasted: 0,
  copyGroup: [],
  stretchToFit: true,
  width: 1000,
  cellSize: 30,
};

export const dashboardReducer: Reducer<DashboardReducerState, DashboardAction> = (
  state: DashboardReducerState = initialState,
  action: DashboardAction
): DashboardReducerState => {
  switch (action.type) {
    case 'MOVE':
      state.dashboardConfiguration = move({
        dashboardConfiguration: state.dashboardConfiguration,
        position: action.payload.position,
        previousPosition: action.payload.prevPosition,
        selectedWidgetIds: action.payload.widgetIds,
        cellSize: action.payload.cellSize,
      });
      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      return state;
    case 'RESIZE':
      state.dashboardConfiguration = resize({
        anchor: action.payload.anchor,
        dashboardConfiguration: state.dashboardConfiguration,
        widgetIds: action.payload.widgetIds,
        changeInPosition: action.payload.changeInPosition,
        cellSize: action.payload.cellSize,
      });
      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      return state;

    case 'DELETE':
      state.dashboardConfiguration = deleteWidgets({
        dashboardConfiguration: state.dashboardConfiguration,
        widgetIdsToDelete: action.payload.widgetIds,
      });
      return state;
    case 'PASTE':
      state.dashboardConfiguration = paste({
        dashboardConfiguration: state.dashboardConfiguration,
        copyGroup: state.copyGroup,
        numTimesCopyGroupHasBeenPasted: state.numTimesCopyGroupHasBeenPasted,
      });
      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      state.numTimesCopyGroupHasBeenPasted++;
      return state;

    case 'CREATE':
      state.dashboardConfiguration = createWidget({
        dashboardConfiguration: state.dashboardConfiguration,
        widgets: action.payload.widgets,
      });
      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      return state;

    case 'UNDO':
      state = undo({
        dashboardAction: action.payload.undoAction,
        dashboardState: state,
      });
      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      if (action.payload.undoAction.type == 'PASTE') {
        state.numTimesCopyGroupHasBeenPasted--;
      }
      return state;
    case 'REDO':
      if (action.payload.redoAction.type == 'PASTE') {
        action.payload.redoAction.payload.copyGroup = state.copyGroup;
        action.payload.redoAction.payload.numTimesPasted = state.numTimesCopyGroupHasBeenPasted;
        state.numTimesCopyGroupHasBeenPasted++;
      }

      state = redo({
        dashboardAction: action.payload.redoAction,
        dashboardState: state,
      });

      state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      return state;

    case 'COPY':
      state.numTimesCopyGroupHasBeenPasted = 0;
      state.copyGroup = action.payload.copyGroup;
      return state;
    case 'STRETCHTOFIT':
      if (state.stretchToFit) {
        state.stretchToFit = false;
        return state;
      }
      state.stretchToFit = true;
      return state;
    case 'EDITCELLSIZE':
      state.cellSize = action.payload.cellSize;
      return state;
    case 'EDITWIDTH':
      state.width = action.payload.width;
      return state;
    default:
      return state;
  }
};
