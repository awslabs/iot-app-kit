import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CollectionPreferences,
  CollectionPreferencesProps,
} from '@cloudscape-design/components';

import {
  Table,
  TableColumnDefinition,
  useViewport,
} from '@iot-app-kit/react-components';

import EmptyTableComponent from './emptyTableComponent';

import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import type { DashboardState } from '~/store/state';
import type { TableWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { useChartSize } from '~/hooks/useChartSize';

import {
  DEFAULT_PREFERENCES,
  collectionPreferencesProps,
  PROPERTY_FILTERING,
} from './table-config';
import { TABLE_OVERFLOW_HEIGHT, TABLE_WIDGET_MAX_HEIGHT } from '../constants';
import { onUpdateWidgetsAction } from '~/store/actions';
import { useTableItems } from './useTableItems';
import WidgetTile from '~/components/widgets/tile/tile';
import { assetModelQueryToSiteWiseAssetQuery } from '../utils/assetModelQueryToAssetQuery';

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
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  const {
    queryConfig,
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
            chartSize.height > TABLE_OVERFLOW_HEIGHT ? 'auto' : 'scroll',
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
          assistant={assistant}
        />
      </div>
    </WidgetTile>
  );
};

export default TableWidgetComponent;
