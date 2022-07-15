import { Reducer } from 'redux';
import { DashboardConfiguration } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { DashboardAction } from './actions';
import { DefaultDashboardConfiguration } from './dashboardState';

export const dashboardReducer: Reducer<DashboardConfiguration, DashboardAction> = (
  state: DashboardConfiguration = DefaultDashboardConfiguration,
  action: DashboardAction
): DashboardConfiguration => {
  switch (action.type) {
    case 'MOVE': {
      // return the widget moved to previous position
      const { position, prevPosition, widgetIds, cellSize } = action.payload;
      return getMovedDashboardConfiguration({
        dashboardConfiguration: state,
        position: position,
        previousPosition: prevPosition,
        selectedWidgetIds: widgetIds,
        cellSize: cellSize,
      });
    }
    default:
      return state;
  }
};
