import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { v4 as uuid } from 'uuid';

import { Chart } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { AssetPropertyStyles, LineScatterChartWidget, LineStyles, StyledAssetQuery, SymbolStyles } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';
import { ChartOptions, ChartStyleSettingsOptions } from '@iot-app-kit/react-components/src/components/chart/types';
import { AssetPropertyQuery } from '@iot-app-kit/source-iotsitewise';

const mapConnectionStyleToVisualizationType = (connectionStyle: LineStyles['connectionStyle']): ChartStyleSettingsOptions['visualizationType'] => {
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
  };
};
const mapSymboleStyleToSymbol = (symbolStyle: SymbolStyles['style']): ChartStyleSettingsOptions['symbol'] => {
  switch(symbolStyle) {
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
}

const addRefIdToProperty = (assetPropertyQuery: AssetPropertyQuery) => ({
  ...assetPropertyQuery,
  refId: uuid(),
})

const useStyleSettingsAndQuery = (styledAssetQuery?: StyledAssetQuery) => {
  return useMemo(() => {
    if (!styledAssetQuery) {
      return {
        styleSettings: undefined,
        query: undefined,
      }
    }

    const styleSettings: ChartOptions['styleSettings'] = {};

    styledAssetQuery.assets.forEach(asset => {
      asset.properties.forEach(property => {
        if (!property.refId) return;
        styleSettings[property.refId] = mapStyledAssetPropertyToChartStyleSettings(property);
      });
    });

    return {
      styleSettings,
      query: styledAssetQuery
    }

  }, [JSON.stringify(styledAssetQuery)]);
};

const mapStyledAssetPropertyToChartStyleSettings = (styles: AssetPropertyStyles): ChartStyleSettingsOptions => {
  return {
    visualizationType: mapConnectionStyleToVisualizationType(styles.line?.connectionStyle),
    color: styles.color,
    symbol: mapSymboleStyleToSymbol(styles.symbol?.style),
    symbolColor: styles.symbol?.color,
    symbolSize: styles.symbol?.size,
    lineStyle: styles.line?.style,
    lineThickness: styles.line?.thickness,
    yAxis: styles.yAxis,
    significantDigits: styles.significantDigits,
  }
}

const LineScatterChartWidgetComponent: React.FC<LineScatterChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const chartSize = useChartSize(widget);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

  const {
    queryConfig,
    axis,
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { styleSettings } = useStyleSettingsAndQuery(queryConfig.query);
  console.log(styleSettings);
  const query = queryConfig.query;
  // console.log('--------------------------')
  // console.log(query);
  // console.log(qq)
  // console.log('----------------^^^----------')
  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && query ? [iotSiteWiseQuery?.timeSeriesData(query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);
  const aggregation = getAggregation(queryConfig);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <Chart
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axis}
      aggregationType={aggregateToString(aggregation)}
      styleSettings={styleSettings}
      thresholds={thresholds}
      thresholdSettings={{ colorBreachedData: true }}
      significantDigits={significantDigits}
      size={chartSize}
    />
  );
};

export default LineScatterChartWidgetComponent;
