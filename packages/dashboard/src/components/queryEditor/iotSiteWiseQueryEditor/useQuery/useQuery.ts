import { useSelectedWidgets } from '~/features/selection/use-selected-widgets';
import { useDispatch } from 'react-redux';
import { onUpdateWidgetsAction } from '~/store/actions';
import { type IoTSiteWiseDataStreamQuery } from '~/features/queries/queries';
import {
  applyAggregationToQuery,
  applyDefaultStylesToQuery,
  applyResolutionToQuery,
  assignDefaultRefId,
  assignDefaultStyles,
  getCurrentAggregationResolution,
} from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/asset-default-styles';
import {
  isQueryWidgetInstance,
  type QueryWidgetInstance,
} from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/findModelBasedQueryWidgets';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export const styledQueryWidgetOnDrop = (
  updatedQuery: IoTSiteWiseDataStreamQuery,
  widget: QueryWidgetInstance
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
  } satisfies IoTSiteWiseDataStreamQuery;

  const queryWithRefIds = assignDefaultRefId(mergedQuery);

  const queryWithAggregation = applyAggregationToQuery(
    queryWithRefIds,
    aggregation
  );
  const queryWithResolution = applyResolutionToQuery(
    queryWithAggregation,
    resolution
  );
  return applyDefaultStylesToQuery(queryWithResolution);
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
  const dispatch = useDispatch();
  const selectedWidgets = useSelectedWidgets();

  const selectedWidget = isOneWidgetSelected(selectedWidgets)
    ? getFirstWidget(selectedWidgets)
    : undefined;

  const query =
    isWidget(selectedWidget) && 'queryConfig' in selectedWidget.properties
      ? getQueryFromWidget(selectedWidget)
      : undefined;

  function setQuery(
    cb: (
      currentQuery?: IoTSiteWiseDataStreamQuery
    ) => IoTSiteWiseDataStreamQuery | undefined
  ): void {
    // Only update the query if a widget is selected
    if (isWidget(selectedWidget)) {
      let updatedQuery = cb(query);

      if (updatedQuery != null) {
        if (selectedWidget.type === 'xy-plot') {
          updatedQuery = styledQueryWidgetOnDrop(updatedQuery, selectedWidget);
        }

        let updatedWidget = createUpdatedWidget(
          selectedWidget,
          updatedQuery as IoTSiteWiseDataStreamQuery
        );

        if (selectedWidget.type !== 'xy-plot') {
          updatedWidget = assignDefaultStyles(
            updatedWidget as QueryWidgetInstance
          ) as typeof updatedWidget;
        }

        const action = createUpdateAction(updatedWidget);

        dispatch(action);
      }
    }
  }

  return [query, setQuery];
}

function isOneWidgetSelected(
  widgets: WidgetInstance[]
): widgets is [WidgetInstance] {
  return widgets.length === 1;
}

function isWidget(
  widget: WidgetInstance | undefined
): widget is WidgetInstance {
  return Boolean(widget);
}

function getFirstWidget(widgets: WidgetInstance[]): WidgetInstance | undefined {
  return widgets.at(0);
}

function getQueryFromWidget(
  widget: WidgetInstance
): IoTSiteWiseDataStreamQuery | undefined {
  if (isQueryWidgetInstance(widget)) {
    return widget.properties.queryConfig?.query;
  }
}

function createUpdatedWidget(
  widget: WidgetInstance,
  newQuery: IoTSiteWiseDataStreamQuery
): QueryWidgetInstance {
  return {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        source: 'iotsitewise',
        ...('queryConfig' in widget.properties &&
          widget.properties.queryConfig),
        query: newQuery,
      },
    },
  } as QueryWidgetInstance;
}

function createUpdateAction(updatedWidget: QueryWidgetInstance) {
  return onUpdateWidgetsAction({ widgets: [updatedWidget] });
}
