import {
  CollectionPreferences,
  type CollectionPreferencesProps,
} from '@cloudscape-design/components';
import { useDispatch, useSelector } from 'react-redux';
import { Table, useViewport } from '@iot-app-kit/react-components';
import EmptyTableComponent from './emptyTableComponent';
import { useQueries } from '~/features/queries/query-context';
import { useChartSize } from '~/hooks/useChartSize';
import type { DashboardState } from '~/store/state';
import { onUpdateWidgetsAction } from '~/store/actions';
import { useTableItems } from './useTableItems';
import {
  COLLECTION_PREFERENCES_PROPS,
  DEFAULT_PREFERENCES,
  DEFAULT_TABLE_COLUMN_DEFINITIONS,
  PROPERTY_FILTERING,
  TABLE_WIDGET_MAX_HEIGHT,
  TABLE_WIDGET_OVERFLOW_HEIGHT,
  type TABLE_WIDGET_TYPE,
} from './constants';
import { WidgetTile } from '~/features/widget-customization/common/tile';
import type { WidgetComponentProps } from '~/features/widget-customization/types';
import { assetModelQueryToSiteWiseAssetQuery } from '~/features/queries/transform-asset-model-query';
import { createWidgetRenderKey } from '~/features/widget-customization/common/create-widget-render-key';
import { DEFAULT_QUERY_CONFIG } from '~/features/queries/defaults';

export type TableWidgetComponentProps = WidgetComponentProps<
  typeof TABLE_WIDGET_TYPE
>;

export const TableWidgetComponent = ({ widget }: TableWidgetComponentProps) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.decimalPlaces
  );

  const {
    queryConfig = DEFAULT_QUERY_CONFIG,
    thresholds,
    significantDigits: widgetSignificantDigits,
    styleSettings,
    title,
    assistant,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const key = createWidgetRenderKey(widget.id);

  const { assets = [], assetModels = [] } = queryConfig.query ?? {};
  const combinedAssets = assetModelQueryToSiteWiseAssetQuery({
    assets,
    assetModels,
  });
  // if styleSettings is undefined, pass empty object so useTableItems does not pick name property
  const items = useTableItems(
    { ...queryConfig.query, assets: combinedAssets },
    styleSettings ?? {}
  );

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;
  const chartSize = useChartSize(widget);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dispatch = useDispatch();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    /* Condition to check table column resizer className to stop onMouseDouwn event
      propagation to fix widget dragging issue while column resizing */
    if (target.className.includes('resizer')) {
      e.stopPropagation();
    }
  };

  const setPreferences = (detail: CollectionPreferencesProps.Preferences) => {
    dispatch(
      onUpdateWidgetsAction({
        widgets: [
          {
            ...widget,
            properties: { ...widget.properties, pageSize: detail.pageSize },
          },
        ],
      })
    );
  };

  return (
    <WidgetTile widget={widget}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        data-testid='table-widget-component'
        onMouseDown={handleMouseDown}
        style={{
          maxHeight:
            chartSize.height > TABLE_WIDGET_MAX_HEIGHT
              ? `${TABLE_WIDGET_MAX_HEIGHT}px`
              : chartSize.height,
          overflow:
            chartSize.height > TABLE_WIDGET_OVERFLOW_HEIGHT ? 'auto' : 'scroll',
        }}
      >
        <Table
          titleText={title}
          resizableColumns
          key={key}
          queries={queries}
          viewport={viewport}
          columnDefinitions={DEFAULT_TABLE_COLUMN_DEFINITIONS}
          items={items}
          thresholds={thresholds}
          significantDigits={significantDigits}
          styles={styleSettings}
          sortingDisabled
          stickyHeader
          pageSize={widget.properties.pageSize ?? DEFAULT_PREFERENCES.pageSize}
          paginationEnabled
          empty={<EmptyTableComponent />}
          preferences={
            !readOnly && (
              <CollectionPreferences
                {...COLLECTION_PREFERENCES_PROPS}
                preferences={{
                  pageSize:
                    widget.properties.pageSize ?? DEFAULT_PREFERENCES.pageSize,
                }}
                onConfirm={({ detail }) => setPreferences(detail)}
              />
            )
          }
          propertyFiltering={PROPERTY_FILTERING}
          assistant={assistant}
        />
      </div>
    </WidgetTile>
  );
};
