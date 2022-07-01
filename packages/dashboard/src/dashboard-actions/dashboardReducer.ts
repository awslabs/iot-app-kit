import { combineReducers, createStore, Reducer } from 'redux';
import { Position, Rect, OnResize, Anchor, DashboardConfiguration, ResizeAction, DashboardAction } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { onMoveAction, MoveAction } from './actions';
import { getSelectedWidgetIds } from './select';
import { resize } from './resize';
import { trimWidgetPosition } from '../components/iot-dashboard/trimWidgetPosition';

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
      console.log(action.payload.changeInPosition);
      return resize({
        anchor: action.payload.anchor,
        dashboardConfiguration: state,
        widgetIds: action.payload.widgetIds,
        changeInPosition: action.payload.changeInPosition,
        cellSize: action.payload.cellSize,
      }).map(trimWidgetPosition);

    default:
      //console.log("i'm being noticed!!");
      return state;
  }
};

const store = createStore(dashboardReducer);
