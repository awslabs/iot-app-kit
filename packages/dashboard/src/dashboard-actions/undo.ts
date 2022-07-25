import { CreateAction, DeleteAction, DashboardAction, DashboardReducerState } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { resize } from './resize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';
import { reverseCreate } from './reverse-actions/reverseCreate';
import { deleteWidgets } from './delete';
import { reverseDelete } from './reverse-actions/reverseDelete';
import { createWidget } from './createWidget';
import { reversePaste } from './reverse-actions/reversePaste';

export const undo = ({
  dashAction,
  dashboardState,
}: {
  dashAction: DashboardAction;
  dashboardState: DashboardReducerState;
}): DashboardReducerState => {
  switch (dashAction.type) {
    case 'MOVE':
      const newMoveAction: DashboardAction = reverseMove(dashAction);
      if (newMoveAction.type == 'MOVE') {
        dashboardState.dashboardConfiguration = getMovedDashboardConfiguration({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          cellSize: newMoveAction.payload.cellSize,
          position: newMoveAction.payload.position,
          previousPosition: newMoveAction.payload.prevPosition,
          selectedWidgetIds: newMoveAction.payload.widgetIds,
        });
      }
      return dashboardState;

    case 'RESIZE':
      const newResizeAction: DashboardAction = reverseResize(dashAction);
      if (newResizeAction.type == 'RESIZE') {
        dashboardState.dashboardConfiguration = resize({
          anchor: newResizeAction.payload.anchor,
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgetIds: newResizeAction.payload.widgetIds,
          changeInPosition: newResizeAction.payload.changeInPosition,
          cellSize: newResizeAction.payload.cellSize,
        });
      }
      return dashboardState;
    case 'CREATE':
      const deleteAction: DeleteAction = reverseCreate(dashAction);
      dashboardState.dashboardConfiguration = deleteWidgets({
        widgetIdsToDelete: deleteAction.payload.widgetIds,
        dashboardConfiguration: dashboardState.dashboardConfiguration,
      });

      return dashboardState;

    case 'DELETE':
      const createAction: CreateAction = reverseDelete(dashAction, dashboardState.dashboardConfiguration);
      dashboardState.dashboardConfiguration = createWidget({
        dashboardConfiguration: createAction.payload.dashboardConfiguration,
        widgets: createAction.payload.widgets,
      });

      return dashboardState;
    case 'PASTE':
      const reversePasteAction: DeleteAction = reversePaste(dashboardState.dashboardConfiguration);
      dashboardState.dashboardConfiguration = deleteWidgets({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        widgetIdsToDelete: reversePasteAction.payload.widgetIds,
      });
      return dashboardState;
    case 'STRETCHTOFIT':
      if (dashboardState.stretchToFit) {
        dashboardState.stretchToFit = false;
        return dashboardState;
      }
      dashboardState.stretchToFit = true;
      return dashboardState;
    case 'EDITCELLSIZE':
      dashboardState.cellSize = dashAction.payload.cellSize;
      return dashboardState;
    case 'EDITWIDTH':
      dashboardState.width = dashAction.payload.width;
      return dashboardState;
    default:
      return dashboardState;
  }
};
