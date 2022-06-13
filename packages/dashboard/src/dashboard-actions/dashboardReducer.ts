import { Reducer } from 'redux';
import { DashboardConfiguration } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { dashboardAction } from './actions';

export const dashboardReducer: Reducer<DashboardConfiguration, dashboardAction> = (
  state: DashboardConfiguration = [],
  action: dashboardAction
): DashboardConfiguration => {
  switch (action.type) {
    case 'MOVE':
      // return the widget moved to previous position
      const { position, prevPosition, widgetIds, cellSize } = action.payload;
      return getMovedDashboardConfiguration({
        dashboardConfiguration: state,
        position: prevPosition,
        previousPosition: position,
        selectedWidgetIds: widgetIds,
        cellSize: cellSize,
      });

    default:
      return state;
  }
};
