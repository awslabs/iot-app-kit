import { createStore, Reducer } from 'redux';
import { DashboardConfiguration, DashboardAction } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { resize } from './resize';
import { trimWidgetPosition } from '../components/iot-dashboard/trimWidgetPosition';
import { deleteWidgets } from './delete';
import { paste } from './paste';
import { createWidget } from './createWidget';
import { undo } from './undo';

export type DashboardReducerState = {
  dashboardWidgets: DashboardConfiguration;
  selectedWidgetIds: string[];
  cellSize: number;
};

export const dashboardReducer: Reducer<DashboardConfiguration, DashboardAction> = (
  state: DashboardConfiguration = [],
  action: DashboardAction
): DashboardConfiguration => {
  switch (action.type) {
    case 'MOVE':
      return getMovedDashboardConfiguration({
        dashboardConfiguration: state,
        position: action.payload.position,
        previousPosition: action.payload.prevPosition,
        selectedWidgetIds: action.payload.widgetIds,
        cellSize: action.payload.cellSize,
      }).map(trimWidgetPosition);
    case 'RESIZE':
      return resize({
        anchor: action.payload.anchor,
        dashboardConfiguration: state,
        widgetIds: action.payload.widgetIds,
        changeInPosition: action.payload.changeInPosition,
        cellSize: action.payload.cellSize,
      }).map(trimWidgetPosition);

    case 'DELETE':
      return deleteWidgets({
        dashboardConfiguration: state,
        widgetIdsToDelete: action.payload.widgetIds,
      });
    case 'PASTE':
      return paste({
        dashboardConfiguration: state,
        copyGroup: action.payload.copyGroup,
        numTimesCopyGroupHasBeenPasted: action.payload.numTimesCopyGroupHasBeenPasted,
      }).map(trimWidgetPosition);

    case 'CREATE':
      return createWidget({
        dashboardConfiguration: state,
        widgets: action.payload.widgets,
      }).map(trimWidgetPosition);

    case 'UNDO':
      console.log('undo action: ', action.payload.undoAction);
      return undo({
        dashAction: action.payload.undoAction,
        dashboardConfiguration: state,
      }).map(trimWidgetPosition);
    case 'REDO':
      return undo({
        dashAction: action.payload.redoAction,
        dashboardConfiguration: state,
      }).map(trimWidgetPosition);

    default:
      return state;
  }
};
