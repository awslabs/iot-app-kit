import { DeleteAction, onDeleteAction } from '../../dashboard-actions/actions';
import { DashboardConfiguration, Widget } from '../../types';

export const reversePaste = ({
  dashboardConfiguration,
  copyGroup,
}: {
  dashboardConfiguration: DashboardConfiguration;
  copyGroup: Widget[];
}): DeleteAction => {
  if (copyGroup) {
    const widgetsToDelete: Widget[] = [];
    for (let i = 0; i < copyGroup.length; i++) {
      const recentWidget = dashboardConfiguration.widgets.pop();
      if (recentWidget) {
        widgetsToDelete.push(recentWidget);
      }
    }
    const newDeleteAction = onDeleteAction({ widgets: widgetsToDelete });
    return newDeleteAction;
  }
  return onDeleteAction({ widgets: [] });
};
