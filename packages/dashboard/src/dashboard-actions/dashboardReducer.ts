import { createStore, Reducer } from 'redux';
import { DashboardConfiguration, DashboardAction } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { resize } from './resize';
import { trimWidgetPosition } from '../components/iot-dashboard/trimWidgetPosition';
import { deleteWidgets } from './delete';
import { paste } from './paste';

export type DashboardReducerState = {
  dashboardWidgets: DashboardConfiguration;
  selectedWidgetIds: string[];
  cellSize: number;
  //dashboardConfiguration: DashboardConfiguration,
};

export const dashboardReducer: Reducer<DashboardConfiguration, DashboardAction> = (
  state: DashboardConfiguration = [],
  action: DashboardAction
): DashboardConfiguration => {
  switch (action.type) {
    case 'MOVE':
      //returns a state of the dashboard where
      const { position, prevPosition, widgetIds, cellSize } = action.payload;
      console.log('I am move');
      return getMovedDashboardConfiguration({
        dashboardConfiguration: state,
        position: position,
        previousPosition: prevPosition,
        selectedWidgetIds: widgetIds,
        cellSize: cellSize,
      }).map(trimWidgetPosition);
    case 'RESIZE':
      console.log('I am resize');

      return resize({
        anchor: action.payload.anchor,
        dashboardConfiguration: state,
        widgetIds: action.payload.widgetIds,
        changeInPosition: action.payload.changeInPosition,
        cellSize: action.payload.cellSize,
      }).map(trimWidgetPosition);

    case 'DELETE':
      console.log('i am delete');
      return deleteWidgets({
        dashboardConfiguration: state,
        widgetIdsToDelete: action.payload.widgetIds,
      });
    case 'PASTE':
      console.log('i am paste');
      return paste({
        dashboardConfiguration: state,
        copyGroup: action.payload.copyGroup,
        numTimesCopyGroupHasBeenPasted: action.payload.numTimesCopyGroupHasBeenPasted,
      });
    default:
      return state;
  }
};
