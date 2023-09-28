import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { useDispatch } from 'react-redux';
import { onUpdateWidgetsAction } from '~/store/actions';
import { DashboardWidget } from '~/types';
import { applyDefaultStylesToQuery } from '~/customization/widgets/utils/assetQuery/applyDefaultStylesToQuery';
import { assignDefaultStyles } from '~/customization/widgets/utils/assignDefaultStyleSettings';
import { QueryWidget } from '~/customization/widgets/types';
import { assignDefaultRefId } from '~/customization/widgets/utils/assetQuery/assignDefaultRefId';
import { applyAggregationToQuery } from '~/customization/widgets/utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '~/customization/widgets/utils/assetQuery/applyResolutionToQuery';
import { getCurrentAggregationResolution } from '~/customization/widgets/utils/widgetAggregationUtils';

type Query = NonNullable<QueryWidget['properties']['queryConfig']['query']>;
type QueryProperty = { queryConfig: { query: Query } };
type WidgetWithQuery = DashboardWidget<QueryProperty>;

export const styledQueryWidgetOnDrop = (updatedQuery: Query, widget: QueryWidget) => {
  const mergedQuery = { assets: [], properties: [], ...updatedQuery };

  const queryWithRefIds = assignDefaultRefId(mergedQuery);

  const { aggregation, resolution } = getCurrentAggregationResolution(widget);

  const queryWithAggregation = applyAggregationToQuery(queryWithRefIds, aggregation);
  const queryWithResolution = applyResolutionToQuery(queryWithAggregation, resolution);
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
export function useQuery(): [Query | undefined, (cb: (currentQuery?: Query) => Query | undefined) => void] {
  const dispatch = useDispatch();
  const selectedWidgets = useSelectedWidgets<QueryProperty>();
  const selectedWidget = isOneWidgetSelected(selectedWidgets) ? getFirstWidget(selectedWidgets) : undefined;

  const query =
    isWidget(selectedWidget) && 'queryConfig' in selectedWidget.properties
      ? getQueryFromWidget(selectedWidget)
      : undefined;

  function setQuery(cb: (currentQuery?: Query) => Query | undefined): void {
    // Only update the query if a widget is selected
    if (isWidget(selectedWidget)) {
      let updatedQuery = cb(query);

      if (updatedQuery != null) {
        if (selectedWidget.type === 'line-scatter-chart') {
          // @ts-expect-error TODO: Fix this
          updatedQuery = styledQueryWidgetOnDrop(updatedQuery, selectedWidget);
        }

        let updatedWidget = createUpdatedWidget(selectedWidget, updatedQuery as Query);

        if (selectedWidget.type !== 'line-scatter-chart') {
          updatedWidget = assignDefaultStyles(updatedWidget as QueryWidget) as typeof updatedWidget;
        }

        const action = createUpdateAction(updatedWidget);

        dispatch(action);
      }
    }
  }

  return [query, setQuery];
}

function isOneWidgetSelected(widgets: WidgetWithQuery[]): widgets is [WidgetWithQuery] {
  return widgets.length === 1;
}

function isWidget(widget: WidgetWithQuery | undefined): widget is WidgetWithQuery {
  return Boolean(widget);
}

function getFirstWidget(widgets: WidgetWithQuery[]): WidgetWithQuery | undefined {
  return widgets.at(0);
}

function getQueryFromWidget(widget: WidgetWithQuery): Query {
  return widget.properties.queryConfig.query;
}

function createUpdatedWidget(widget: WidgetWithQuery, newQuery: Query): WidgetWithQuery {
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

function createUpdateAction(updatedWidget: WidgetWithQuery) {
  return onUpdateWidgetsAction({ widgets: [updatedWidget] });
}
