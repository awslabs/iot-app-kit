import React from 'react';
import type { MouseEvent } from 'react';
import { SeriesOption } from 'echarts';
import { useECharts, useResizeableEChart } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { HotKeys } from 'react-hotkeys';
import { useTrendCursors } from './trendCursor';
import { Resizable, ResizeHandle } from 'react-resizable';
import Legend from './legend/table';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';
import { MultiYAxisLegend } from './multiYAxis/multiYAxis';
import { useContextMenu } from './contextMenu/useContextMenu';
import { DEFAULT_CHART_VISUALIZATION } from './eChartsConstants';
import { useDataZoom } from './hooks/useDataZoom';
import { useViewport } from '../../hooks/useViewport';
import { useHandleChartEvents } from './events/useHandleChartEvents';
import { useChartDataset } from './chartOptions/useChartDataset';
import { useChartConfiguration } from './chartOptions/useChartConfiguration';

import './chart.css';

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
const BaseChart = ({
  viewport,
  queries,
  onChartOptionsChange,
  size = { width: 500, height: 500 },
  ...options
}: ChartOptions) => {
  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  const { group } = useViewport();

  // convert TimeSeriesDataQuery to TimeSeriesData
  const {
    isLoading,
    dataStreams,
    thresholds: queryThresholds,
    utilizedViewport,
    visibleData,
  } = useVisualizedDataStreams(queries, viewport);

  //handle dataZoom updates, which are dependent on user events and viewportInMS changes
  const viewportInMs = useDataZoom(chartRef, utilizedViewport);

  const allThresholds = [...queryThresholds, ...(options.thresholds ?? [])];

  const { series, yAxis } = useChartConfiguration(chartRef, {
    group,
    isLoading,
    dataStreams,
    thresholds: allThresholds,
    visibleData,
    ...options,
  });

  useChartDataset(chartRef, dataStreams);

  const isBottomAligned = options.legend?.position === 'bottom';

  // Setup resize container and calculate size for echarts
  const {
    chartWidth,
    chartHeight,
    rightLegendWidth,
    rightLegendHeight,
    onResize,
    minConstraints,
    maxConstraints,
    leftLegendRef,
  } = useResizeableEChart(
    chartRef,
    size,
    options.legend,
    isBottomAligned,
    onChartOptionsChange
  );

  const {
    handleContextMenu,
    showContextMenu,
    contextMenuPos,
    setShowContextMenu,
  } = useContextMenu();

  // trendcursors relies on the old implementation of series option which had data points in the option
  const mappedSeries = series.map(({ id: seriesId, ...options }) => {
    const dataPoints =
      dataStreams.find(({ id: dataStreamId }) => dataStreamId === seriesId)
        ?.data ?? [];
    const data = dataPoints.map(({ x, y }) => [x, y]);

    return {
      ...options,
      data,
    } as SeriesOption;
  });
  // this will handle all the Trend Cursors operations
  const {
    onContextMenuClickHandler,
    trendCursors,
    trendCursorKeyMap,
    trendCursorHandlers,
  } = useTrendCursors({
    chartRef,
    initialGraphic: options.graphic,
    size: { width: chartWidth, height: chartHeight },
    series: mappedSeries,
    chartId: options.id,
    viewportInMs,
    groupId: group,
    onContextMenu: handleContextMenu,
    visualization:
      options.defaultVisualizationType ?? DEFAULT_CHART_VISUALIZATION,
    significantDigits: options.significantDigits,
    yAxisOptions: {
      yAxis,
    },
  });

  const menuOptionClickHandler = ({
    action,
  }: {
    action: Action;
    e: React.MouseEvent;
  }) => {
    onContextMenuClickHandler({ action, posX: contextMenuPos.x });
    setShowContextMenu(false);
  };

  // handle chart event updates
  const { chartEventsKeyMap, chartEventsHandlers } =
    useHandleChartEvents(chartRef);

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
  const setHandles = (position: string): ResizeHandle[] => {
    switch (position) {
      case 'left':
      case 'bottom':
        return ['sw'];
      default:
        return ['se'];
    }
  };

  return (
    <div
      className={`base-chart-container ${options.legend?.position}-position`}
    >
      <Resizable
        height={chartHeight}
        width={chartWidth}
        onResize={onResize}
        axis={`${isBottomAligned ? 'y' : 'x'}`}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        handle={
          <span
            className={
              options.legend?.visible
                ? 'react-resizable-handle react-resizable-handle-se'
                : ''
            }
            data-gesture='resize'
          />
        }
        onResizeStart={(e) => e.stopPropagation()}
        onResizeStop={(e) => e.stopPropagation()}
        resizeHandles={[...setHandles(options.legend?.position || 'right')]}
      >
        <HotKeys
          keyMap={hotKeyMap}
          handlers={hotKeyHandlers}
          className='chart-rightlegend-container'
        >
          <div className='base-chart-left-legend' ref={leftLegendRef}>
            <MultiYAxisLegend datastreams={dataStreams} height={chartHeight} />
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            ref={ref}
            onMouseDown={handleMouseDown}
            className='base-chart-element'
            style={{
              height: chartHeight,
              width: chartWidth,
            }}
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
      {options.legend?.visible && (
        <div
          style={{
            height: rightLegendHeight,
            width: rightLegendWidth,
          }}
        >
          <Legend
            {...options.legend}
            series={series}
            graphic={trendCursors}
            datastreams={dataStreams}
            width={rightLegendWidth.toString()}
          />
        </div>
      )}
    </div>
  );
};

export default BaseChart;
