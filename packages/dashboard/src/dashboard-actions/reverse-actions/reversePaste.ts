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
    return onDeleteAction({
      widgets: dashboardConfiguration.widgets.slice(dashboardConfiguration.widgets.length - copyGroup.length),
    });
  }
  return onDeleteAction({ widgets: [] });
};
