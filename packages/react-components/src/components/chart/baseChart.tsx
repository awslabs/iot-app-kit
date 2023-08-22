import React from 'react';
import {
  useECharts,
  useResizeableEChart,
  useGroupableEChart,
  useLoadableEChart,
  useEChartOptions,
} from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { useConvertedOptions } from './converters/convertOptions';
import { useSeriesAndYAxis } from './converters/convertSeriesAndYAxis';
import { HotKeys } from 'react-hotkeys';
import useTrendCursors from './hooks/useTrendCursors';
import { Resizable } from 'react-resizable';
import Legend from './legend/legend';
import { useChartStyleSettings } from './converters/convertStyles';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';
import { useChartId } from './hooks/useChartId';
import { useChartSetOptionSettings } from './hooks/useChartSetOptionSettings';
import { MultiYAxisLegend } from './legend/multiYAxis';

import './chart.css';
import { useXAxis } from './hooks/useXAxis';
import { useContextMenu } from './hooks/useContextMenu';
import { useViewportToMS } from './hooks/useViewportToMS';
import { DEFAULT_CHART_VISUALIZATION } from './eChartsConstants';

/**
 * Developer Notes:
 *
 * The general organization of the Chart follows this flow:
 *
 * 1. setup echarts instance using useECharts
 * 2. get datastreams using useVisualizedDataStreams
 * 3. use datastreams / chart options to compute datastructures
 *    needed to implement various features and adapt them to the echarts api
 * 4. set all  the options in echarts using useEChartOptions
 * 5. do not make use of setOptions in the individual feature, useEChartOptions should be the only place.
 *    Exception: when deleting an item or in general when removing some elements you may need to use setOptions
 *
 */

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const BaseChart = ({ viewport, queries, size = { width: 500, height: 500 }, ...options }: ChartOptions) => {
  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  const chartId = useChartId(options.id);

  // convert TimeSeriesDataQuery to TimeSeriesData
  const { isLoading, dataStreams, thresholds: queryThresholds } = useVisualizedDataStreams(queries, viewport);
  const allThresholds = [...queryThresholds, ...(options.thresholds ?? [])];

  // Setup resize container and calculate size for echart
  const { height, chartWidth, rightLegendWidth, onResize, minConstraints, maxConstraints, leftLegendRef } =
    useResizeableEChart(chartRef, size);

  // apply group to echarts
  useGroupableEChart(chartRef, options.groupId);

  // apply loading animation to echarts
  useLoadableEChart(chartRef, isLoading);

  // calculate style settings for all datastreams
  const [styleSettingsMap] = useChartStyleSettings(dataStreams, options);

  // adapt datastreams into echarts series and yAxis data
  const { series, yAxis, yMins, yMaxs } = useSeriesAndYAxis(dataStreams, {
    styleSettings: styleSettingsMap,
    axis: options.axis,
    thresholds: allThresholds,
  });
  const shouldShowYAxisLegend = yMins.length > 0 || yMaxs.length > 0;

  const { handleContextMenu, showContextMenu, contextMenuPos, setShowContextMenu, keyMap } = useContextMenu();

  // const viewportInMs = viewportToMs(viewport);
  const viewportInMs = useViewportToMS(viewport);

  const xAxis = useXAxis(viewportInMs, options.axis);

  // this will handle all the Trend Cursors operations
  const { onContextMenuClickHandler, trendCursors, hotKeyHandlers } = useTrendCursors({
    chartRef,
    initialGraphic: options.graphic,
    size: { width: chartWidth, height },
    series,
    chartId,
    viewportInMs,
    groupId: options.groupId,
    onContextMenu: handleContextMenu,
    visualization: options.defaultVisualizationType ?? DEFAULT_CHART_VISUALIZATION,
  });

  const menuOptionClickHandler = ({ action }: { action: Action; e: React.MouseEvent }) => {
    onContextMenuClickHandler({ action, posX: contextMenuPos.x });
    setShowContextMenu(false);
  };

  // adapt chart options into echarts options
  const convertedOptions = useConvertedOptions({
    ...options,
    title: series.length === 0 ? 'No data present' : '',
  });

  // determine the set option settings
  const settings = useChartSetOptionSettings(dataStreams);

  // set all the options on the echarts instance
  useEChartOptions(
    chartRef,
    {
      ...convertedOptions,
      series,
      yAxis,
      xAxis,
      graphic: trendCursors,
    },
    settings
  );

  return (
    <div className='base-chart-container'>
      <div className='base-chart-left-legend' ref={leftLegendRef}>
        {shouldShowYAxisLegend && <MultiYAxisLegend height={height} yMax={yMaxs} yMin={yMins} />}
      </div>
      <Resizable
        height={height}
        width={chartWidth}
        onResize={onResize}
        axis='x'
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
      >
        <HotKeys keyMap={keyMap} handlers={hotKeyHandlers} style={{ position: 'relative' }}>
          <div ref={ref} className='base-chart-element' style={{ height, width: chartWidth }} />
          {/*TODO: should not show when in dashboard */}
          {showContextMenu && (
            <ChartContextMenu
              position={{ x: contextMenuPos.x, y: contextMenuPos.y }}
              onOutSideClickHandler={() => setShowContextMenu(false)}
              menuOptionClickHandler={menuOptionClickHandler}
              trendCursors={trendCursors}
            />
          )}
        </HotKeys>
      </Resizable>
      <div style={{ height, width: rightLegendWidth }}>
        <Legend series={series} graphic={trendCursors} datastreams={dataStreams} />
      </div>
    </div>
  );
};

export default BaseChart;
