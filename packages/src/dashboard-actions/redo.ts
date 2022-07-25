import {
  Widget,
  CreateAction,
  DeleteAction,
  DashboardConfiguration,
  DashboardAction,
  MoveAction,
  onCreateAction,
  ResizeAction,
  DeleteActionInput,
  onDeleteAction,
  PasteAction,
  onPasteAction,
  DashboardReducerState,
} from '../types';
import { getMovedDashboardConfiguration } from './move';
//import { DashboardAction } from './actions';
import { resize } from './resize';
import { reverseMove } from './reverse-actions/reverseMove';
import { reverseResize } from './reverse-actions/reverseResize';
import { State } from '@stencil/core';
import { active } from 'd3';
import { activePoints } from '@synchro-charts/core/dist/types/components/charts/sc-webgl-base-chart/activePoints';
import { reverseCreate } from './reverse-actions/reverseCreate';
import { deleteWidgets } from './delete';
import { reverseDelete } from './reverse-actions/reverseDelete';
import { createWidget } from './createWidget';
import { reversePaste } from './reverse-actions/reversePaste';
import { paste } from './paste';

export const redo = ({
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
      dashboardState.dashboardConfiguration = createWidget({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        widgets: dashAction.payload.widgets,
      });
      return dashboardState;
    case 'DELETE':
      dashboardState.dashboardConfiguration = deleteWidgets({
        widgetIdsToDelete: dashAction.payload.widgetIds,
        dashboardConfiguration: dashboardState.dashboardConfiguration,
      });
      return dashboardState;
    case 'PASTE':
      const pasteAction: PasteAction = onPasteAction(dashAction.payload);
      dashboardState.dashboardConfiguration = paste({
        dashboardConfiguration: dashboardState.dashboardConfiguration,
        copyGroup: dashAction.payload.copyGroup,
        numTimesCopyGroupHasBeenPasted: dashAction.payload.numTimesPasted,
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
