import { get } from 'lodash';
import { DashboardWidget } from '~/types';

export const disableAdd = (
  selectedWidgets: DashboardWidget<Record<string, unknown>>[],
  collectionPropsLength?: number
) => {
  const selectedWidget = selectedWidgets?.at(0);
  const currWidgetType = selectedWidget?.type;

  let widgetBasedDisable = false;
  switch (currWidgetType) {
    case 'status':
    case 'kpi': {
      const assets =
        get(selectedWidget, 'properties.queryConfig.query.assets') ?? [];
      if (assets.length) {
        widgetBasedDisable = true;
      }
      break;
    }
    default:
  }
  return (
    collectionPropsLength === 0 ||
    selectedWidgets.length !== 1 ||
    widgetBasedDisable
  );
};
