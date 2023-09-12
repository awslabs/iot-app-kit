import { ResourcePanelItem } from "~/components/resourceExplorer/components/panel";
import { QueryWidget } from "../types";
import { getCurrentAggregationResolution } from "../utils/widgetAggregationUtils";
import { mergeAssetQueries } from "~/util/mergeAssetQueries";
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import { DashboardWidget } from "~/types";

export const queryWidgetOnDrop = (item: ResourcePanelItem, widget: DashboardWidget) => {
  const queryWidget = widget as QueryWidget;
  const { assetSummary } = item;
  const currentAssets = queryWidget.properties.queryConfig.query?.assets ?? [];

  const { aggregation, resolution } = getCurrentAggregationResolution(queryWidget);

  const mergedAssets = mergeAssetQueries(currentAssets, {
    assetId: assetSummary.assetId || '',
    properties: assetSummary.properties.map(({ propertyId }) => ({
      propertyId: propertyId || '',
      aggregationType: aggregation,
      resolution: resolution,
    })),
  });

  const widgetWithStyles = assignDefaultStyles({
    ...queryWidget,
    properties: {
      ...queryWidget.properties,
      queryConfig: {
        ...queryWidget.properties.queryConfig,
        query: {
          assets: mergedAssets,
        },
      },
    },
  });

  return widgetWithStyles;
};
