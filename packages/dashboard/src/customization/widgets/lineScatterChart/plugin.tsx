import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import LineScatterChartWidgetComponent from './component';
import LineIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { LineScatterChartWidget } from '../types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import { assignDefaultRefId } from '../utils/assetQuery/assignDefaultRefId';
import { getCurrentAggregationResolution } from '../utils/widgetAggregationUtils';
import { applyAggregationToQuery } from '../utils/assetQuery/applyAggregationToQuery';
import { applyResolutionToQuery } from '../utils/assetQuery/applyResolutionToQuery';
import { DashboardWidget } from '~/types';
import { applyDefaultStylesToQuery } from '../utils/assetQuery/applyDefaultStylesToQuery';

export const styledQueryWidgetOnDrop = (item: ResourcePanelItem, widget: DashboardWidget) => {
  const lineScatterWidget = widget as LineScatterChartWidget;
  const { assetSummary } = item;

  const currentQuery = lineScatterWidget.properties.queryConfig.query ?? { assets: [] };
  const currentAssets = currentQuery.assets;

  const currentAssetsWithDropped = mergeAssetQueries(currentAssets, {
    assetId: assetSummary.assetId || '',
    properties: assetSummary.properties.map(({ propertyId }) => ({
      propertyId: propertyId || '',
    })),
  });

  const mergedQuery = { assets: currentAssetsWithDropped };

  const queryWithRefIds = assignDefaultRefId(mergedQuery);

  const { aggregation, resolution } = getCurrentAggregationResolution(lineScatterWidget);

  const queryWithAggregation = applyAggregationToQuery(queryWithRefIds, aggregation);
  const queryWithResolution = applyResolutionToQuery(queryWithAggregation, resolution);
  const queryWithDefaultStyles = applyDefaultStylesToQuery(queryWithResolution);

  return {
    ...lineScatterWidget,
    properties: {
      ...lineScatterWidget.properties,
      queryConfig: {
        ...lineScatterWidget.properties.queryConfig,
        query: queryWithDefaultStyles,
      },
    },
  };
};

export const lineScatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineScatterChartWidget>('line-scatter-chart', {
      render: (widget) => (
        <MultiQueryWidget
          widget={widget}
          onDrop={styledQueryWidgetOnDrop}
          allowedDataTypes={[PropertyDataType.DOUBLE, PropertyDataType.INTEGER]}
        >
          <LineScatterChartWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Line',
        icon: LineIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        line: {
          connectionStyle: 'linear',
          style: 'solid',
        },
        symbol: {
          style: 'filled-circle',
        },
        axis: {
          yVisible: true,
          xVisible: true,
        },
        legend: {
          visible: true,
        },
      }),
      initialSize: {
        height: 250,
        width: 370,
      },
    });
  },
};
