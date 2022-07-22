import { DashboardConfiguration, DeleteAction, onDeleteAction, PasteAction } from '../../types';

export const reversePaste = (dashboardConfiguration: DashboardConfiguration): DeleteAction => {
  let widgetToRemove = dashboardConfiguration.widgets.pop();
  if (widgetToRemove) {
    const newDeleteAction: DeleteAction = onDeleteAction({
      widgets: [widgetToRemove],
      widgetIds: [widgetToRemove.id],
    });
    return newDeleteAction;
  }
  const failedDelete: DeleteAction = onDeleteAction({
    widgetIds: [],
    widgets: [],
  });
  return failedDelete;
};
