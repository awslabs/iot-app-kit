import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Chart, useViewport } from '@iot-app-kit/react-components';
// FIXME: Export ChartOptions from @iot-app-kit/react-components
// FIXME: Export ChartStyleSettingsOptions from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import {
  ChartOptions,
  ChartStyleSettingsOptions,
} from '@iot-app-kit/react-components/src/components/chart/types';

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
import { onUpdateWidgetsAction } from '~/store/actions';
import { useRefreshRate } from '~/customization/hooks/useRefreshRate';

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

const mapSymboleStyleToSymbol = (
  symbolStyle: SymbolStyles['style']
): ChartStyleSettingsOptions['symbol'] => {
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

const useAdaptedStyleSettings = (
  rootStyles: LineAndScatterStyles,
  styledAssetQuery?: IoTSiteWiseDataStreamQuery
) => {
  const depQuery = JSON.stringify(styledAssetQuery);
  const depStyles = JSON.stringify(rootStyles);
  return useMemo(() => {
    if (!styledAssetQuery) return {};

    const styleSettings: ChartOptions['styleSettings'] = {};

    styledAssetQuery.assets?.forEach((asset) => {
      asset.properties.forEach((property) => {
        if (!property.refId) return;
        styleSettings[property.refId] =
          mapStyledAssetPropertyToChartStyleSettings(rootStyles, property);
      });
    });

    styledAssetQuery.properties?.forEach((property) => {
      if (!property.refId) return;
      styleSettings[property.refId] =
        mapStyledAssetPropertyToChartStyleSettings(rootStyles, property);
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
    visualizationType: mapConnectionStyleToVisualizationType(
      styles.line?.connectionStyle ?? line?.connectionStyle
    ),
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

// memoizing so any change to the chart does not cause the axis to create a new reference
const useConvertedAxis = (axis: ChartAxisOptions | undefined = {}) => {
  const { yVisible, xVisible, yMax, yMin, yLabel } = axis;

  return useMemo(
    () => ({
      showY: yVisible,
      showX: xVisible,
      yMin: yMin,
      yMax: yMax,
      yLabel: yLabel,
    }),
    [yVisible, xVisible, yMax, yMin, yLabel]
  );
};

const LineScatterChartWidgetComponent: React.FC<LineScatterChartWidget> = (
  widget
) => {
  const { viewport } = useViewport();
  const dispatch = useDispatch();

  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const chartSize = useChartSize(widget);
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );
  const [refreshRate] = useRefreshRate();

  const {
    title,
    queryConfig,
    axis,
    thresholds,
    line,
    symbol,
    legend,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const query = queryConfig.query;
  const queries = useQueries(query);

  const mappedQuery = assetModelQueryToSiteWiseAssetQuery(query);
  const styleSettings = useAdaptedStyleSettings({ line, symbol }, mappedQuery);

  const aggregation = getAggregation(widget);

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  const convertedAxis = useConvertedAxis(axis);

  // the 4 is from the widget tile top, bottom boder lines height
  // the 8 is from the left and right border lines width
  const size = { width: chartSize.width - 8, height: chartSize.height - 44 };

  const onChartOptionsChange = (options: Pick<ChartOptions, 'legend'>) => {
    dispatch(
      onUpdateWidgetsAction({
        widgets: [
          {
            ...widget,
            properties: {
              ...widget.properties,
              legend: { ...legend, ...options.legend },
            },
          },
        ],
      })
    );
  };

  const isEmptyWidget = queries.length === 0;
  if (isEmptyWidget) {
    return (
      <WidgetTile widget={widget}>
        <NoChartData
          icon={lineSvgDark}
          emptyStateText='Browse and select to add your asset properties in your line widget.'
        />
      </WidgetTile>
    );
  }

  return (
    <WidgetTile widget={widget} title={title}>
      <Chart
        id={widget.id}
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        axis={convertedAxis}
        aggregationType={aggregateToString(aggregation)}
        styleSettings={styleSettings}
        thresholds={thresholds}
        significantDigits={significantDigits}
        size={size}
        legend={legend}
        onChartOptionsChange={onChartOptionsChange}
        defaultVisualizationType={mapConnectionStyleToVisualizationType(
          line?.connectionStyle
        )}
        refreshRate={refreshRate}
      />
    </WidgetTile>
  );
};

export default LineScatterChartWidgetComponent;
