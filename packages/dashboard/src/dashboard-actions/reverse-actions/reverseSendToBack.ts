import { DashboardConfiguration } from '../../types';
import { ChangeLayerAction, onChangeLayerAction, SendToBackAction } from '../actions';

export const reverseSendToBack = ({
  dashboardConfiguration,
  action,
}: {
  dashboardConfiguration: DashboardConfiguration;
  action: SendToBackAction;
}): ChangeLayerAction => {
  const widgets = action.payload.widgets;
  const widgetIds = widgets.map((widget) => widget.id);

  const bottomZIndex = Math.min(
    ...dashboardConfiguration.widgets.filter((widget) => !widgetIds.includes(widget.id)).map(({ z }) => z)
  );
  const maxSelectedZ = Math.max(...widgets.map(({ z }) => z));

  const zOffset = (bottomZIndex - 1 - maxSelectedZ) * -1;
  return onChangeLayerAction({
    widgets,
    zOffset,
  });
};
