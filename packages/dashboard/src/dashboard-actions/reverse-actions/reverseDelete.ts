import { DeleteAction, CreateAction, onCreateAction, DashboardConfiguration } from '../../types';

export const reverseDelete = (
  deleteAction: DeleteAction,
  dashboardConfiguration: DashboardConfiguration
): CreateAction => {
  const createAction: CreateAction = onCreateAction({
    widgets: deleteAction.payload.widgets,
    dashboardConfiguration: dashboardConfiguration,
  });
  return createAction;
};
