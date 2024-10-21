import { useCallback, useMemo } from 'react';
import type { QueryWidget } from '~/customization/widgets/types';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyDefaultStylesToQuery } from '~/customization/widgets/utils/assetQuery/applyDefaultStylesToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import { assignDefaultRefId } from '~/customization/widgets/utils/assetQuery/assignDefaultRefId';
import { assignDefaultStyles } from '~/customization/widgets/utils/assignDefaultStyleSettings';
import { getCurrentAggregationResolution } from '~/customization/widgets/utils/widgetAggregationUtils';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { useUpdateWidget } from '~/store/dashboard/use-update-widget';
import type { DashboardWidget, IoTSiteWiseDataStreamQuery } from '~/types';

type WidgetWithQuery = DashboardWidget<{
  queryConfig: { query: IoTSiteWiseDataStreamQuery };
}>;

export const styledQueryWidgetOnDrop = (
  updatedQuery: IoTSiteWiseDataStreamQuery,
  widget: QueryWidget
) => {
  const { aggregation, resolution } = getCurrentAggregationResolution(widget);

  const mergedQuery = {
    assets: [],
    properties: [],
    assetModels: [],
    alarms: [],
    alarmModels: [],
    requestSettings: {
      aggregationType: aggregation,
      resolution: resolution,
    },
    ...updatedQuery,
  };

  const queryWithRefIds = assignDefaultRefId(mergedQuery);

  const queryWithAggregation = applyAggregationToQuery(
    queryWithRefIds,
    aggregation
  );
  const queryWithResolution = applyResolutionToQuery(
    queryWithAggregation,
    resolution
  );
  const queryWithDefaultStyles = applyDefaultStylesToQuery(queryWithResolution);

  return queryWithDefaultStyles;
};

/**
 * Use to get and set the query of the selected widget.
 *
 * @remarks
 *
 * TECH DEBT: This hook only supports single selection. If multiple assets are selected, the query will be undefined.
 * Usage requires additional handling the lack of single select support in the UI. This is a leaky abstraction.
 */
export function useQuery(): [
  IoTSiteWiseDataStreamQuery | undefined,
  (
    cb: (
      currentQuery?: IoTSiteWiseDataStreamQuery
    ) => IoTSiteWiseDataStreamQuery | undefined
  ) => void
] {
  const selectedWidgets = useSelectedWidgets();
  const selectedWidget = selectedWidgets[0];
  const updateWidget = useUpdateWidget();

  const query = useMemo(() => {
    return isWidget(selectedWidget) &&
      'queryConfig' in selectedWidget.properties
      ? getQueryFromWidget(selectedWidget)
      : undefined;
  }, [selectedWidget]);

  const setQuery = useCallback(
    (
      cb: (
        currentQuery?: IoTSiteWiseDataStreamQuery
      ) => IoTSiteWiseDataStreamQuery | undefined
    ): void => {
      // Only update the query if a widget is selected
      if (isWidget(selectedWidget)) {
        let updatedQuery = cb(query);

        if (updatedQuery != null) {
          if (selectedWidget.type === 'xy-plot') {
            // @ts-expect-error TODO: Fix this
            updatedQuery = styledQueryWidgetOnDrop(
              updatedQuery,
              selectedWidget
            );
          }

          let updatedWidget = createUpdatedWidget(
            selectedWidget,
            updatedQuery as IoTSiteWiseDataStreamQuery
          );

          if (selectedWidget.type !== 'xy-plot') {
            updatedWidget = assignDefaultStyles(
              updatedWidget as QueryWidget
            ) as typeof updatedWidget;
          }

          updateWidget(updatedWidget);
        }
      }
    },
    [query, updateWidget, selectedWidget]
  );

  return [query, setQuery];
}

function isWidget(
  widget: WidgetWithQuery | undefined
): widget is WidgetWithQuery {
  return Boolean(widget);
}

function getQueryFromWidget(
  widget: WidgetWithQuery
): IoTSiteWiseDataStreamQuery {
  return widget.properties.queryConfig.query;
}

function createUpdatedWidget(
  widget: WidgetWithQuery,
  newQuery: IoTSiteWiseDataStreamQuery
): WidgetWithQuery {
  const updatedWidget = {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        ...widget.properties.queryConfig,
        query: newQuery,
      },
    },
  };

  return updatedWidget;
}
