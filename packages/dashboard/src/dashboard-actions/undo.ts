import { DashboardConfiguration, MoveAction, ResizeAction } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { DashboardAction } from './actions';
import { resize } from './resize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';

export const undo = (
  dashAction: DashboardAction | MoveAction | ResizeAction,
  dashboardConfiguration: DashboardConfiguration
): DashboardConfiguration => {
  switch (dashAction.type) {
    case 'MOVE':
      const newMoveAction: DashboardAction = reverseMove(dashAction);
      if (newMoveAction.type == 'MOVE') {
        return getMovedDashboardConfiguration({
          dashboardConfiguration: dashboardConfiguration,
          cellSize: newMoveAction.payload.cellSize,
          position: newMoveAction.payload.position,
          previousPosition: newMoveAction.payload.prevPosition,
          selectedWidgetIds: newMoveAction.payload.widgetIds,
        });
      }
      return dashboardConfiguration;

    case 'RESIZE':
      const newResizeAction: DashboardAction = reverseResize(dashAction);
      if (newResizeAction.type == 'RESIZE') {
        return resize({
          anchor: newResizeAction.payload.anchor,
          dashboardConfiguration: dashboardConfiguration,
          widgetIds: newResizeAction.payload.widgetIds,
          changeInPosition: newResizeAction.payload.changeInPosition,
          cellSize: newResizeAction.payload.cellSize,
        });
      }
      return dashboardConfiguration;

    default:
      return dashboardConfiguration;
  }
};
