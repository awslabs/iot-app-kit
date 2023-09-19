import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Chart } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type {
  AssetPropertyStyles,
  ChartAxisOptions,
  LineAndScatterStyles,
  LineScatterChartWidget,
  LineStyles,
  StyledAssetQuery,
  SymbolStyles,
} from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';
import { ChartOptions, ChartStyleSettingsOptions } from '@iot-app-kit/react-components/src/components/chart/types';
// import { applyAggregationToQuery } from '../utils/assetQuery/applyAggregationToQuery';
// import { applyResolutionToQuery } from '../utils/assetQuery/applyResolutionToQuery';
import WidgetTile from '~/components/widgets/tile/tile';

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

const useAdaptedStyleSettings = (rootStyles: LineAndScatterStyles, styledAssetQuery?: StyledAssetQuery) => {
  return useMemo(() => {
    if (!styledAssetQuery) return {};

    const styleSettings: ChartOptions['styleSettings'] = {};

    styledAssetQuery.assets.forEach((asset) => {
      asset.properties.forEach((property) => {
        if (!property.refId) return;
        styleSettings[property.refId] = mapStyledAssetPropertyToChartStyleSettings(rootStyles, property);
      });
    });

    return styleSettings;
  }, [JSON.stringify(styledAssetQuery), JSON.stringify(rootStyles)]);
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
    lineThickness: styles.line?.thickness,
    yAxis: styles.yAxis,
    significantDigits: styles.significantDigits,
  };
};

const convertAxis = (axis: ChartAxisOptions | undefined) => ({
  showY: axis?.yVisible,
  showX: axis?.xVisible,
  yMin: axis?.yMin,
  yMax: axis?.yMax,
});

const LineScatterChartWidgetComponent: React.FC<LineScatterChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
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
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  console.log('thresholds', thresholds);

  const query = queryConfig.query;
  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && query ? [iotSiteWiseQuery?.timeSeriesData(query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const styleSettings = useAdaptedStyleSettings({ line, symbol }, query);

  const aggregation = getAggregation(widget);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  // there may be better ways to fix this, i.e. not have -44 and let the chart container  take its parent height,
  // the problem is that the Resizable component needs a "height" to be provided,
  // so not entirely sure if we can have a mechanism where the container auto adjusts the height
  // the 44 is from the widget tile header's height
  const size = { width: chartSize.width, height: chartSize.height - 44 };

  return (
    <WidgetTile widget={widget} removeable title={title}>
      <Chart
        key={key}
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        axis={convertAxis(axis)}
        aggregationType={aggregateToString(aggregation)}
        styleSettings={styleSettings}
        thresholds={thresholds}
        significantDigits={significantDigits}
        size={size}
      />
    </WidgetTile>
  );
};

export default LineScatterChartWidgetComponent;
