import CollectionPreferences, {
  type CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import {
  Table,
  type TableColumnDefinition,
  useViewport,
} from '@iot-app-kit/react-components';
import React from 'react';
import type { TableWidget } from '~/customization/widgets/types';
import { useQueries } from '~/dashboard/queryContext';
import { useMode } from '~/features/dashboard-mode';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { WidgetTile } from '~/features/widget-tile';
import { useChartSize } from '~/hooks/useChartSize';
import { useUpdateWidget } from '~/store/dashboard/use-update-widget';
import { TABLE_OVERFLOW_HEIGHT, TABLE_WIDGET_MAX_HEIGHT } from '../constants';
import { assetModelQueryToSiteWiseAssetQuery } from '../utils/assetModelQueryToAssetQuery';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { EmptyTableComponent } from './emptyTableComponent';
import {
  collectionPreferencesProps,
  DEFAULT_PREFERENCES,
  PROPERTY_FILTERING,
} from './table-config';
import { useTableItems } from './useTableItems';

export const DEFAULT_TABLE_COLUMN_DEFINITIONS: TableColumnDefinition[] = [
  {
    key: 'property',
    header: 'Property',
    sortingField: 'property',
  },
  {
    key: 'value',
    header: 'Latest value',
    sortingField: 'value',
  },
  {
    key: 'unit',
    header: 'Unit',
    sortingField: 'unit',
  },
];

const TableWidgetComponent: React.FC<TableWidget> = (widget) => {
  const { viewport } = useViewport();
  const updateWidget = useUpdateWidget();
  const [dashboardSignificantDigits] = useDashboardDecimalPlaces();

  const {
    queryConfig,
    thresholds,
    significantDigits: widgetSignificantDigits,
    styleSettings,
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
  const { mode } = useMode();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    /* Condition to check table column resizer className to stop onMouseDouwn event
      propagation to fix widget dragging issue while column resizing */
    if (target.className.includes('resizer')) {
      e.stopPropagation();
    }
  };

  const setPreferences = (detail: CollectionPreferencesProps.Preferences) => {
    updateWidget({
      ...widget,
      properties: { ...widget.properties, pageSize: detail.pageSize },
    });
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
            chartSize.height > TABLE_OVERFLOW_HEIGHT ? 'auto' : 'scroll',
        }}
      >
        <Table
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
            mode === 'edit' && (
              <CollectionPreferences
                {...collectionPreferencesProps}
                preferences={{
                  pageSize:
                    widget.properties.pageSize ?? DEFAULT_PREFERENCES.pageSize,
                }}
                onConfirm={({ detail }) => setPreferences(detail)}
              />
            )
          }
          propertyFiltering={PROPERTY_FILTERING}
        />
      </div>
    </WidgetTile>
  );
};

export default TableWidgetComponent;
