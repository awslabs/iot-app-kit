import { DashboardState } from '../types';
import { DashboardAction } from './actions';
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
  dashboardState: DashboardState;
}): DashboardState => {
  switch (dashboardAction.type) {
    case 'MOVE':
      return {
        ...(dashboardAction = reverseMove(dashboardAction)),
        ...dashboardState,
        dashboardConfiguration: move({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          cellSize: dashboardState.cellSize,
          position: dashboardAction.payload.position,
          previousPosition: dashboardAction.payload.prevPosition,
          selectedWidgetIds: dashboardAction.payload.widgetIds || dashboardState.selectedWidgetIds,
        }),
      };

    case 'RESIZE':
      return {
        ...(dashboardAction = reverseResize(dashboardAction)),
        ...dashboardState,
        dashboardConfiguration: resize({
          anchor: dashboardAction.payload.anchor,
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgetIds: dashboardAction.payload.widgetIds || dashboardState.selectedWidgetIds,
          changeInPosition: dashboardAction.payload.changeInPosition,
          cellSize: dashboardState.cellSize,
        }),
      };

    case 'CREATE':
      return {
        ...(dashboardAction = reverseCreate(dashboardAction)),
        ...dashboardState,
        dashboardConfiguration: deleteWidgets({
          widgetIdsToDelete: dashboardAction.payload.widgets.map(({ id }) => id),
          dashboardConfiguration: dashboardState.dashboardConfiguration,
        }),
      };

    case 'DELETE':
      return {
        ...(dashboardAction = reverseDelete(dashboardAction)),
        ...dashboardState,
        dashboardConfiguration: createWidget({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgets: dashboardAction.payload.widgets,
        }),
      };

    case 'PASTE':
      return {
        ...(dashboardAction = reversePaste({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          copyGroup: dashboardState.copyGroup,
        })),
        ...dashboardState,
        dashboardConfiguration: deleteWidgets({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgetIdsToDelete: dashboardAction.payload.widgets.map(({ id }) => id),
        }),
        numTimesCopyGroupHasBeenPasted: dashboardState.numTimesCopyGroupHasBeenPasted - 1,
      };

    case 'UPDATE':
      return {
        ...(dashboardState = { ...dashboardState, ...dashboardAction.payload.previousField }),
      };

    default:
      return dashboardState;
  }
};
