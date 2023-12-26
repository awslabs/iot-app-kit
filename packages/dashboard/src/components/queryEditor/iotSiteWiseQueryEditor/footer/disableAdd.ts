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
    case 'kpi':
      if (get(selectedWidget, 'properties.queryConfig.query')) {
        widgetBasedDisable = true;
      }
      break;
    default:
  }
  return collectionPropsLength === 0 || selectedWidgets.length !== 1 || widgetBasedDisable;
};
