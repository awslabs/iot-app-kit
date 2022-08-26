import { DashboardConfiguration } from '../../types';
import { BringToFrontAction, ChangeLayerAction, onChangeLayerAction } from '../actions';

export const reverseBringToFront = ({
  dashboardConfiguration,
  action,
}: {
  dashboardConfiguration: DashboardConfiguration;
  action: BringToFrontAction;
}): ChangeLayerAction => {
  const widgets = action.payload.widgets;
  const widgetIds = widgets.map((widget) => widget.id);
  const topZIndex = Math.max(
    ...dashboardConfiguration.widgets.filter((widget) => !widgetIds.includes(widget.id)).map(({ z }) => z)
  );
  const minSelectedZ = Math.min(...widgets.map(({ z }) => z));

  const zOffset = (topZIndex + 1 - minSelectedZ) * -1;
  return onChangeLayerAction({
    widgets,
    zOffset,
  });
};
