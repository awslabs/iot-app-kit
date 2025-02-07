import get from 'lodash-es/get';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export const disableAdd = (
  selectedWidgets: WidgetInstance[],
  collectionPropsLength?: number
) => {
  const selectedWidget = selectedWidgets?.at(0);
  const currWidgetType = selectedWidget?.type;

  let widgetBasedDisable = false;
  switch (currWidgetType) {
    case 'kpi':
    case 'gauge': {
      const modeledProperties =
        get(selectedWidget, 'properties.queryConfig.query.assets') ?? [];
      const unmodeledProperties =
        get(selectedWidget, 'properties.queryConfig.query.properties') ?? [];
      const assetModelProperties =
        get(selectedWidget, 'properties.queryConfig.query.assetModels') ?? [];
      if (
        modeledProperties.length ||
        unmodeledProperties.length ||
        assetModelProperties.length ||
        collectionPropsLength !== 1
      ) {
        widgetBasedDisable = true;
      }
      break;
    }
    default:
  }

  return (
    collectionPropsLength === undefined ||
    collectionPropsLength === 0 ||
    selectedWidgets.length !== 1 ||
    widgetBasedDisable
  );
};
