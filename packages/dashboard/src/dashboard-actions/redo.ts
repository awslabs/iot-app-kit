import { DashboardAction, DashboardReducerState } from '../types';
import { move } from './move';
//import { DashboardAction } from './actions';
import { resize } from './resize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';
import { deleteWidgets } from './delete';
import { createWidget } from './createWidget';
import { paste } from './paste';

export const redo = ({
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
      dashboardState.dashboardConfiguration = createWidget({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        widgets: dashboardAction.payload.widgets,
      });
      return dashboardState;
    case 'DELETE':
      dashboardState.dashboardConfiguration = deleteWidgets({
        widgetIdsToDelete: dashboardAction.payload.widgetIds,
        dashboardConfiguration: dashboardState.dashboardConfiguration,
      });
      return dashboardState;
    case 'PASTE':
      dashboardState.dashboardConfiguration = paste({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        copyGroup: dashboardAction.payload.copyGroup,
        numTimesCopyGroupHasBeenPasted: dashboardAction.payload.numTimesPasted,
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
