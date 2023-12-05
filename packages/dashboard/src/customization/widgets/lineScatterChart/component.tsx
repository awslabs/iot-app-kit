import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Chart, useViewport } from '@iot-app-kit/react-components';
// FIXME: Export ChartOptions from @iot-app-kit/react-components
// FIXME: Export ChartStyleSettingsOptions from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { ChartOptions, ChartStyleSettingsOptions } from '@iot-app-kit/react-components/src/components/chart/types';

import type { DashboardState } from '~/store/state';
import type {
  AssetPropertyStyles,
  ChartAxisOptions,
  LineAndScatterStyles,
  LineScatterChartWidget,
  LineStyles,
  SymbolStyles,
} from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';
import WidgetTile from '~/components/widgets/tile/tile';
import NoChartData from '../components/no-chart-data';
import { default as lineSvgDark } from './line-dark.svg';
import { IoTSiteWiseDataStreamQuery } from '~/types';
import { assetModelQueryToSiteWiseAssetQuery } from '../utils/assetModelQueryToAssetQuery';

const mapConnectionStyleToVisualizationType = (
  connectionStyle: LineStyles['connectionStyle']
): ChartStyleSettingsOptions['visualizationType'] => {
  switch (connectionStyle) {
    case 'linear':
      return 'line';
    case 'none':
      return 'scatter';
    case 'step-start':
    case 'step-middle':
    case 'step-end':
      return connectionStyle;
    case 'curve':
      return undefined;
    default:
      return undefined;
  }
};
const mapSymboleStyleToSymbol = (symbolStyle: SymbolStyles['style']): ChartStyleSettingsOptions['symbol'] => {
  switch (symbolStyle) {
    case 'circle':
      return 'emptyCircle';
    case 'filled-circle':
      return 'circle';
    case 'rectangle':
      return 'rect';
    case 'rounded-rectangle':
      return 'roundRect';
    case 'triangle':
    case 'arrow':
    case 'diamond':
    case 'pin':
    case 'none':
      return symbolStyle;

    default:
      return undefined;
  }
};

const emptyLegendObject = {};

const useAdaptedStyleSettings = (rootStyles: LineAndScatterStyles, styledAssetQuery?: IoTSiteWiseDataStreamQuery) => {
  const depQuery = JSON.stringify(styledAssetQuery);
  const depStyles = JSON.stringify(rootStyles);
  return useMemo(() => {
    if (!styledAssetQuery) return {};

    const styleSettings: ChartOptions['styleSettings'] = {};

    styledAssetQuery.assets?.forEach((asset) => {
      asset.properties.forEach((property) => {
        if (!property.refId) return;
        styleSettings[property.refId] = mapStyledAssetPropertyToChartStyleSettings(rootStyles, property);
      });
    });

    styledAssetQuery.properties?.forEach((property) => {
      if (!property.refId) return;
      styleSettings[property.refId] = mapStyledAssetPropertyToChartStyleSettings(rootStyles, property);
    });

    return styleSettings;
    // disabling because query and root styles are stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depQuery, depStyles]);
};

const mapStyledAssetPropertyToChartStyleSettings = (
  { line, symbol }: LineAndScatterStyles,
  styles: AssetPropertyStyles
): ChartStyleSettingsOptions => {
  return {
    visualizationType: mapConnectionStyleToVisualizationType(styles.line?.connectionStyle ?? line?.connectionStyle),
    color: styles.color,
    symbol: mapSymboleStyleToSymbol(styles.symbol?.style ?? symbol?.style),
    symbolColor: styles.symbol?.color,
    symbolSize: styles.symbol?.size,
    lineStyle: styles.line?.style ?? line?.style,
    lineThickness: styles.line?.thickness ?? line?.thickness,
    yAxis: styles.yAxis?.visible ? styles.yAxis : undefined,
    significantDigits: styles.significantDigits,
  };
};

const convertAxis = (axis: ChartAxisOptions | undefined) => ({
  showY: axis?.yVisible,
  showX: axis?.xVisible,
  yMin: axis?.yMin,
  yMax: axis?.yMax,
});

const removeHiddenDataStreams = (widget: LineScatterChartWidget): LineScatterChartWidget => ({
  ...widget,
  properties: {
    ...widget.properties,
    queryConfig: {
      ...widget.properties.queryConfig,
      query: {
        assets:
          widget.properties.queryConfig?.query?.assets?.map((asset) => ({
            ...asset,
            properties: asset.properties.filter((property) => {
              return property.visible !== false;
            }),
          })) || [],
        properties: widget.properties.queryConfig?.query?.properties?.filter((property) => property.visible !== false),
        assetModels:
          widget.properties.queryConfig?.query?.assetModels?.map((assetModel) => ({
            ...assetModel,
            properties: assetModel.properties.filter((property) => {
              return property.visible !== false;
            }),
          })) || [],
      },
    },
  },
});

const LineScatterChartWidgetComponent: React.FC<LineScatterChartWidget> = (widget) => {
  const widgetToDisplay = removeHiddenDataStreams(widget);
  const { viewport } = useViewport();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const chartSize = useChartSize(widget);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

  const {
    title,
    queryConfig,
    axis,
    thresholds,
    line,
    symbol,
    legend,
    significantDigits: widgetSignificantDigits,
  } = widgetToDisplay.properties;

  const query = queryConfig.query;
  const filteredQuery = {
    ...query,
    assets:
      query?.assets
        ?.map((asset) => {
          const { assetId, properties } = asset;
          return {
            assetId,
            properties: properties.filter((p) => p.visible ?? true),
          };
        })
        .filter((asset) => asset.properties.length > 0) ?? [],
    assetModels:
      query?.assetModels
        ?.map((assetModel) => {
          const { assetModelId, assetIds, properties } = assetModel;
          return {
            assetModelId,
            assetIds,
            properties: properties.filter((p) => p.visible ?? true),
          };
        })
        .filter((assetModel) => assetModel.properties.length > 0) ?? [],
  };

  const queries = useQueries(filteredQuery);

  const mappedQuery = assetModelQueryToSiteWiseAssetQuery(query);
  const styleSettings = useAdaptedStyleSettings({ line, symbol }, mappedQuery);

  const aggregation = getAggregation(widget);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  // there may be better ways to fix this, i.e. not have -44 and let the chart container  take its parent height,
  // the problem is that the Resizable component needs a "height" to be provided,
  // so not entirely sure if we can have a mechanism where the container auto adjusts the height
  // the 44 is from the widget tile header's height
  const size = { width: chartSize.width, height: chartSize.height - 44 };

  const isEmptyWidget = queries.length === 0;
  if (isEmptyWidget) {
    return (
      <WidgetTile widget={widget} removeable title={title}>
        <NoChartData
          icon={lineSvgDark}
          emptyStateText='Browse and select to add your asset properties in your line widget.'
        />
      </WidgetTile>
    );
  }

  return (
    <WidgetTile widget={widget} removeable title={title}>
      <Chart
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        axis={convertAxis(axis)}
        aggregationType={aggregateToString(aggregation)}
        styleSettings={styleSettings}
        thresholds={thresholds}
        significantDigits={significantDigits}
        size={size}
        legend={legend?.visible ? emptyLegendObject : undefined}
        defaultVisualizationType={mapConnectionStyleToVisualizationType(line?.connectionStyle)}
      />
    </WidgetTile>
  );
};

export default LineScatterChartWidgetComponent;
