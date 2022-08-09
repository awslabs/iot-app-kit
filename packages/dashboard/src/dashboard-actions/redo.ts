import { DashboardState } from '../types';
import { DashboardAction } from '../dashboard-actions/actions';
import { move } from './move';
import { resize } from './resize';
import { deleteWidgets } from './delete';
import { createWidget } from './createWidget';
import { paste } from './paste';

export const redo = ({
  dashboardAction,
  dashboardState,
}: {
  dashboardAction: DashboardAction;
  dashboardState: DashboardState;
}): DashboardState => {
  switch (dashboardAction.type) {
    case 'MOVE':
      return {
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
        ...dashboardState,
        dashboardConfiguration: createWidget({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          widgets: dashboardAction.payload.widgets,
        }),
      };

    case 'DELETE':
      return {
        ...dashboardState,
        dashboardConfiguration: deleteWidgets({
          widgetIdsToDelete: dashboardAction.payload.widgets.map(({ id }) => id),
          dashboardConfiguration: dashboardState.dashboardConfiguration,
        }),
      };

    case 'PASTE':
      return {
        ...dashboardState,

        dashboardConfiguration: paste({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          copyGroup: dashboardState.copyGroup,
          numTimesCopyGroupHasBeenPasted: dashboardState.numTimesCopyGroupHasBeenPasted,
          position: dashboardAction.payload,
          cellSize: dashboardState.cellSize,
        }),
        numTimesCopyGroupHasBeenPasted: dashboardState.numTimesCopyGroupHasBeenPasted + 1,
      };
    case 'UPDATE':
      return {
        ...(dashboardState = { ...dashboardState, ...dashboardAction.payload.fieldsToUpdate }),
      };

    default:
      return dashboardState;
  }
};
