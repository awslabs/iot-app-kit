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

export const undo = ({
  dashAction,
  dashboardConfiguration,
}: {
  dashAction: DashboardAction;
  dashboardConfiguration: DashboardConfiguration;
}): DashboardConfiguration => {
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
    case 'CREATE':
      const deleteAction: DeleteAction = reverseCreate(dashAction);
      console.log('Widgets to delete in dashaction ', dashAction.payload.widgets);

      console.log('in undo widgets to delete ', deleteAction.payload.widgetIds);
      return deleteWidgets({
        widgetIdsToDelete: deleteAction.payload.widgetIds,
        dashboardConfiguration: dashboardConfiguration,
      });

    default:
      return dashboardConfiguration;
  }
};
