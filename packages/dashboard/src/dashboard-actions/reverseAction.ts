import { DashboardConfiguration, MoveAction, ResizeAction } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { DashboardAction } from './actions';
import { resize } from './resize';

export const reverseAction = (dashAction: DashboardAction): DashboardAction | MoveAction | ResizeAction => {
  switch (dashAction.type) {
    case 'MOVE':
      //create new move action to return later
      const newMoveAction: MoveAction = dashAction;
      if (typeof dashAction.payload.prevPosition != 'undefined') {
        //flip previous and current positions
        const tempPosition = dashAction.payload.position;
        newMoveAction.payload.position = dashAction.payload.prevPosition;
        newMoveAction.payload.prevPosition = tempPosition;
        return newMoveAction;
      }

      return newMoveAction;

    case 'RESIZE':
      const newResizeAction: ResizeAction = dashAction;
      //invert changeInPosition values
      newResizeAction.payload.changeInPosition.x = dashAction.payload.changeInPosition.x * -1;
      newResizeAction.payload.changeInPosition.y = dashAction.payload.changeInPosition.y * -1;
      return newResizeAction;

    default:
      return dashAction;
  }
};

export const applyReverseAction = (
  dashAction: DashboardAction | MoveAction | ResizeAction,
  dashboardConfiguration: DashboardConfiguration
): DashboardConfiguration => {
  switch (dashAction.type) {
    case 'MOVE':
      let newMoveAction: DashboardAction = reverseAction(dashAction);
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
      let newResizeAction: DashboardAction = reverseAction(dashAction);
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
