import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { TableWidget } from '../types';
import TableWidgetComponent from './component';
import TableIcon from './icon';
import { assignDefaultStyles } from '~/customization/widgets/utils/assignDefaultStyleSettings';
import { ExtendedPanelAssetSummary } from '~/components/resourceExplorer/nextResourceExplorer';
import { ColumnDefinition } from '@iot-app-kit/table';
import { toId } from '@iot-app-kit/source-iotsitewise';

const defaultColumnDefinitions: ColumnDefinition[] = [
  {
    key: 'property',
    header: 'Property',
  },
  {
    key: 'value',
    header: 'Latest value',
  },
  {
    key: 'unit',
    header: 'Unit',
  },
];
const tableOnDropAsset = (
  assetSummary: ExtendedPanelAssetSummary,
  widget: TableWidget,
  update: (widget: TableWidget) => void
) => {
  const { queryAssetsParam = [], unit, rawName, assetName } = assetSummary;
  const asset = queryAssetsParam[0];
  const updatedWidget: TableWidget = {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        ...widget.properties.queryConfig,
        query: {
          assets: [...(widget.properties.queryConfig.query?.assets || []), asset],
        },
      },
      columnDefinitions: widget.properties.columnDefinitions || defaultColumnDefinitions,
      items: [
        ...(widget.properties.items || []),
        ...asset.properties.map(({ propertyId }) => ({
          property: `${rawName} (${assetName})`,
          unit,
          value: {
            $cellRef: {
              id: toId({
                assetId: asset.assetId,
                propertyId: propertyId,
              }),
              resolution: 0,
            },
          },
        })),
      ],
    },
  };

  update(assignDefaultStyles(updatedWidget));
};
export const tablePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TableWidget>('iot-table', {
      render: (widget) => (
        <MultiQueryWidget {...widget} onDropAsset={tableOnDropAsset}>
          <TableWidgetComponent {...widget} />
        </MultiQueryWidget>
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
