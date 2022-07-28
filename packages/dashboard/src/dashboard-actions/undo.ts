import { DashboardAction, DashboardReducerState } from '../types';
import { move } from './move';
import { resize } from './resize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';
import { reverseCreate } from './reverse-actions/reverseCreate';
import { deleteWidgets } from './delete';
import { reverseDelete } from './reverse-actions/reverseDelete';
import { createWidget } from './createWidget';
import { reversePaste } from './reverse-actions/reversePaste';

export const undo = ({
  dashboardAction,
  dashboardState,
}: {
  dashboardAction: DashboardAction;
  dashboardState: DashboardReducerState;
}): DashboardReducerState => {
  switch (dashboardAction.type) {
    case 'MOVE':
      dashboardAction = reverseMove(dashboardAction);
      if (dashboardAction.type == 'MOVE') {
        dashboardState.dashboardConfiguration = move({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          cellSize: dashboardAction.payload.cellSize,
          position: dashboardAction.payload.position,
          previousPosition: dashboardAction.payload.prevPosition,
          selectedWidgetIds: dashboardAction.payload.widgetIds,
        });
      }
      return dashboardState;

    case 'RESIZE':
      dashboardAction = reverseResize(dashboardAction);
      if (dashboardAction.type == 'RESIZE') {
        dashboardState.dashboardConfiguration = resize({
          anchor: dashboardAction.payload.anchor,
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgetIds: dashboardAction.payload.widgetIds,
          changeInPosition: dashboardAction.payload.changeInPosition,
          cellSize: dashboardAction.payload.cellSize,
        });
      }
      return dashboardState;
    case 'CREATE':
      dashboardAction = reverseCreate(dashboardAction);
      dashboardState.dashboardConfiguration = deleteWidgets({
        widgetIdsToDelete: dashboardAction.payload.widgetIds,
        dashboardConfiguration: dashboardState.dashboardConfiguration,
      });

      return dashboardState;

    case 'DELETE':
      dashboardAction = reverseDelete(dashboardAction, dashboardState.dashboardConfiguration);
      dashboardState.dashboardConfiguration = createWidget({
        dashboardConfiguration: dashboardAction.payload.dashboardConfiguration,
        widgets: dashboardAction.payload.widgets,
      });

      return dashboardState;
    case 'PASTE':
      dashboardAction = reversePaste(dashboardState.dashboardConfiguration);
      dashboardState.dashboardConfiguration = deleteWidgets({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        widgetIdsToDelete: dashboardAction.payload.widgetIds,
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
      dashboardState.cellSize = dashboardAction.payload.cellSize;
      return dashboardState;
    case 'EDITWIDTH':
      dashboardState.width = dashboardAction.payload.width;
      return dashboardState;
    default:
      return dashboardState;
  }
};
