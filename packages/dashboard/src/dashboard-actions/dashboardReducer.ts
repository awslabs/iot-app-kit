import { Reducer } from 'redux';
import { Widgets } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { DashboardAction } from './actions';

export const dashboardReducer: Reducer<Widgets, DashboardAction> = (
  state: Widgets = [],
  action: DashboardAction
): Widgets => {
  switch (action.type) {
    case 'MOVE':
      // return the widget moved to previous position
      const { position, prevPosition, widgetIds, cellSize } = action.payload;
      return getMovedDashboardConfiguration({
        dashboardConfiguration: state,
        position: position,
        previousPosition: prevPosition,
        selectedWidgetIds: widgetIds,
        cellSize: cellSize,
      });

    default:
      return state;
  }
};
