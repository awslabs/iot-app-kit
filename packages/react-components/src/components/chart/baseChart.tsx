import React from 'react';
import type { MouseEvent } from 'react';
import {
  useECharts,
  useResizeableEChart,
  useGroupableEChart,
  useLoadableEChart,
  useEChartOptions,
} from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { useConvertedOptions } from './chartOptions/convertOptions';
import { useSeriesAndYAxis } from './chartOptions/seriesAndYAxis/convertSeriesAndYAxis';
import { HotKeys } from 'react-hotkeys';
import { useTrendCursors } from './trendCursor';
import { Resizable } from 'react-resizable';
import Legend from './legend/legend';
import { useChartStyleSettings } from './chartOptions/style/convertStyles';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';
import { useChartSetOptionSettings } from './chartOptions/useChartSetOptionSettings';
import { MultiYAxisLegend } from './multiYAxis/multiYAxis';

import './chart.css';
import { useContextMenu } from './contextMenu/useContextMenu';
import { useViewportToMS } from './hooks/useViewportToMS';
import { DEFAULT_CHART_VISUALIZATION, DEFAULT_TOOLBOX_CONFIG } from './eChartsConstants';
import { useDataZoom } from './hooks/useDataZoom';
import { useViewport } from '../../hooks/useViewport';
import { getXAxis } from './chartOptions/axes/xAxis';
import { useHandleChartEvents } from './events/useHandleChartEvents';

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

  const { group } = useViewport();

  // convert TimeSeriesDataQuery to TimeSeriesData
  const {
    isLoading,
    dataStreams,
    thresholds: queryThresholds,
    utilizedViewport,
  } = useVisualizedDataStreams(queries, viewport);
  const allThresholds = [...queryThresholds, ...(options.thresholds ?? [])];

  // Setup resize container and calculate size for echarts
  const { height, chartWidth, rightLegendWidth, onResize, minConstraints, maxConstraints, leftLegendRef } =
    useResizeableEChart(chartRef, size, options.legend);

  // apply group to echarts
  useGroupableEChart(chartRef, group);

  // apply loading animation to echarts
  useLoadableEChart(chartRef, isLoading);

  // calculate style settings for all datastreams
  const [styleSettingsMap] = useChartStyleSettings(dataStreams, options);

  // adapt datastreams into echarts series and yAxis data
  const { series, yAxis } = useSeriesAndYAxis(dataStreams, {
    styleSettings: styleSettingsMap,
    axis: options.axis,
    thresholds: allThresholds,
  });

  const { handleContextMenu, showContextMenu, contextMenuPos, setShowContextMenu } = useContextMenu();

  const viewportInMs = useViewportToMS(utilizedViewport);

  const xAxis = getXAxis(options.axis);

  // this will handle all the Trend Cursors operations
  const { onContextMenuClickHandler, trendCursors, trendCursorKeyMap, trendCursorHandlers } = useTrendCursors({
    chartRef,
    initialGraphic: options.graphic,
    size: { width: chartWidth, height },
    series,
    chartId: options.id,
    viewportInMs,
    groupId: group,
    onContextMenu: handleContextMenu,
    visualization: options.defaultVisualizationType ?? DEFAULT_CHART_VISUALIZATION,
    significantDigits: options.significantDigits,
    yAxisOptions: {
      yAxis,
    },
  });

  const menuOptionClickHandler = ({ action }: { action: Action; e: React.MouseEvent }) => {
    onContextMenuClickHandler({ action, posX: contextMenuPos.x });
    setShowContextMenu(false);
  };

  // adapt chart options into echarts options
  const convertedOptions = useConvertedOptions({
    series,
    options,
  });

  // determine the set option settings
  const settings = useChartSetOptionSettings(dataStreams);

  //handle dataZoom updates, which are dependent on user events and viewportInMS changes
  useDataZoom(chartRef, viewportInMs);

  // handle chart event updates
  const { chartEventsOptions, chartEventsKeyMap, chartEventsHandlers } = useHandleChartEvents(chartRef);

  const toolTipOptions = {
    ...convertedOptions.tooltip,
    ...chartEventsOptions.tooltip,
  };

  // set all the options on the echarts instance
  useEChartOptions(
    chartRef,
    {
      ...convertedOptions,
      ...chartEventsOptions,
      tooltip: toolTipOptions,
      series,
      toolbox: DEFAULT_TOOLBOX_CONFIG,
      yAxis,
      xAxis,
      graphic: trendCursors,
      animation: !viewportInMs.isDurationViewport,
      appKitChartId: options.id,
    },
    settings
  );

  const hotKeyMap = {
    ...trendCursorKeyMap,
    ...chartEventsKeyMap,
  };

  const hotKeyHandlers = {
    ...trendCursorHandlers,
    ...chartEventsHandlers,
  };

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target;

    /* Condition to check localName of Canvas to stop onMouseDouwn event 
      propagation to fix widget dragging or moving issue while panning on chart */
    if (target instanceof Element && target.localName === 'canvas') {
      e.stopPropagation();
    }
  };

  return (
    <div className='base-chart-container'>
      <div className='base-chart-left-legend' ref={leftLegendRef}>
        <MultiYAxisLegend datastreams={dataStreams} height={height} />
      </div>
      <Resizable
        height={height}
        width={chartWidth}
        onResize={onResize}
        axis='x'
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        handle={
          <span
            className={options.legend && 'react-resizable-handle react-resizable-handle-se'}
            data-gesture='resize'
          />
        }
        onResizeStart={(e) => e.stopPropagation()}
        onResizeStop={(e) => e.stopPropagation()}
      >
        <HotKeys keyMap={hotKeyMap} handlers={hotKeyHandlers} style={{ position: 'relative' }}>
          <div
            ref={ref}
            onMouseDown={handleMouseDown}
            className='base-chart-element'
            style={{ height, width: chartWidth }}
          />
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
      {options.legend && (
        <div style={{ height, width: rightLegendWidth }}>
          <Legend series={series} graphic={trendCursors} datastreams={dataStreams} width={rightLegendWidth} />
        </div>
      )}
    </div>
  );
};

export default BaseChart;
