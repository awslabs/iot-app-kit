import React from 'react';
import MultiQueryWidgetComponent, { defaultOnDropHandler } from '../queryWidget/multiQueryWidget';
import TableWidgetComponent from './component';
import TableIcon from './icon';
import { toId } from '@iot-app-kit/source-iotsitewise';
import type { DashboardPlugin } from '~/customization/api';
import type { TableWidget } from '../types';
import type { TableColumnDefinition } from '@iot-app-kit/react-components';
import type { onDropHandler } from '~/customization/widgets/queryWidget/multiQueryWidget';

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
const tableOnDropAsset: onDropHandler = (item, widget: TableWidget) => {
  const { assetSummary } = item;
  const { assetName, assetId = '', properties } = assetSummary;

  const newWidget = defaultOnDropHandler(item, widget);
  const newProperties = properties.filter(({ propertyId }) => {
    const assetQuery = widget.properties.queryConfig.query?.assets.find((asset) => asset.assetId === assetId);
    return !assetQuery?.properties.find((property) => property.propertyId === propertyId);
  });

  const updatedWidget: TableWidget = {
    ...newWidget,
    properties: {
      ...newWidget.properties,
      columnDefinitions: widget.properties.columnDefinitions || DEFAULT_TABLE_COLUMN_DEFINITIONS,
      items: [
        ...(widget.properties.items || []),
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
    registerWidget<TableWidget>('iot-table', {
      render: (widget: TableWidget) => (
        <MultiQueryWidgetComponent {...widget} onDropHandler={tableOnDropAsset}>
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
        height: 170,
        width: 270,
      },
    });
  },
};
