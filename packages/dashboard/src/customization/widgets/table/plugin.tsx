import React from 'react';
import MultiQueryWidgetComponent from '../queryWidget/multiQueryWidget';
import TableWidgetComponent, { DEFAULT_TABLE_COLUMN_DEFINITIONS } from './component';
import TableIcon from './icon';
import { toId } from '@iot-app-kit/source-iotsitewise';
import type { DashboardPlugin } from '~/customization/api';
import type { TableWidget } from '../types';
import { TABLE_WIDGET_INITIAL_HEIGHT, TABLE_WIDGET_INITIAL_WIDTH } from './constants';
import { queryWidgetOnDrop } from '../queryWidget/multiQueryWidgetDrop';
import { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';
import { DashboardWidget } from '~/types';

const tableOnDropAsset = (item: ResourcePanelItem, widget: DashboardWidget) => {
  const tableWidget = widget as TableWidget;
  const { assetSummary } = item;
  const { assetName, assetId = '', properties } = assetSummary;

  const newWidget = queryWidgetOnDrop(item, tableWidget);
  const newProperties = properties.filter(({ propertyId }) => {
    const assetQuery = tableWidget.properties.queryConfig.query?.assets.find((asset) => asset.assetId === assetId);
    return !assetQuery?.properties.find((property) => property.propertyId === propertyId);
  });

  const updatedWidget: TableWidget = {
    ...newWidget,
    properties: {
      ...newWidget.properties,
      columnDefinitions: tableWidget.properties.columnDefinitions || DEFAULT_TABLE_COLUMN_DEFINITIONS,
      items: [
        ...(tableWidget.properties.items || []),
        ...newProperties.map(({ propertyId = '', name, unit }) => ({
          property: `${name} (${assetName})`,
          unit,
          value: {
            $cellRef: {
              id: toId({
                assetId,
                propertyId,
              }),
              resolution: 0,
            },
          },
        })),
      ],
    },
  };
  return updatedWidget;
};

export const tablePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TableWidget>('table', {
      render: (widget: TableWidget) => (
        <MultiQueryWidgetComponent widget={widget} onDrop={tableOnDropAsset}>
          <TableWidgetComponent {...widget} />
        </MultiQueryWidgetComponent>
      ),
      componentLibrary: {
        name: 'Table',
        icon: TableIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
      }),
      initialSize: {
        height: TABLE_WIDGET_INITIAL_HEIGHT,
        width: TABLE_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
