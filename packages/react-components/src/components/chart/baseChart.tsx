import React, { useState } from 'react';
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
import { ElementEvent } from 'echarts';
import { useSeriesAndYAxis } from './converters/convertSeriesAndYAxis';
import { HotKeys, KeyMap } from 'react-hotkeys';
import useTrendCursors from './hooks/useTrendCursors';
import { Resizable } from 'react-resizable';
import Legend from './legend/legend';
import { useChartStyleSettings } from './converters/convertStyles';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';
import { useChartId } from './hooks/useChartId';
import { useChartSetOptionSettings } from './hooks/useChartSetOptionSettings';

import './chart.css';

const keyMap: KeyMap = {
  commandDown: { sequence: 'command', action: 'keydown' },
  commandUp: { sequence: 'command', action: 'keyup' },
};

/**
 * Developer Notes:
 * 
 * The general organization of the Chart follows this flow:
 * 
 * 1. setup echarts instance using useECharts
 * 2. get datastreams using useVisualizedDataStreams
 * 3. use datastreams / chart options to compute datastructures
 *    needed to implement various features and adapt them to the echarts api
 * 4. set all of the options in echarts
 */

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size = { width: 500, height: 500 }, ...options }: ChartOptions) => {
  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  const chartId = useChartId(options.id);

  // convert TimeSeriesDataQuery to TimeSeriesData
  const { isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);

  // Setup resize container and calculate size for echart
  const { width, height, chartWidth, onResize, minConstraints, maxConstraints } = useResizeableEChart(chartRef, size);

  // apply group to echart
  useGroupableEChart(chartRef, options.groupId);

  // apply loading animation to echart
  useLoadableEChart(chartRef, isLoading);

  // calculate style settings for all datastreams
  const [styleSettingsMap] = useChartStyleSettings(dataStreams, options);

  const [trendCursors, setTrendCursors] = useState(options.graphic ?? []);
  const [isInCursorAddMode, setIsInCursorAddMode] = useState(false);
  // TECHDEBT: let's try to refactor contet menu state into some hook associated with the component
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: ElementEvent) => {
    setContextMenuPos({ x: e.offsetX, y: e.offsetY });
    setShowContextMenu(!showContextMenu);
    e.stop();
  };

  // adapt datastreams into echarts series and yAxis data
  const { series, yAxis } = useSeriesAndYAxis(dataStreams, { styleSettings: styleSettingsMap, axis: options.axis });

  // this will handle all the Trend Cursors operations
  const { onContextMenuClickHandler } = useTrendCursors({
    ref,
    graphic: trendCursors,
    size: { width: chartWidth, height },
    isInCursorAddMode,
    setGraphic: setTrendCursors,
    series,
    chartId,
    viewport,
    groupId: options.groupId,
    onContextMenu: handleContextMenu,
  });

  const handlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
  };

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

  // set all of the options on the echarts instance
  useEChartOptions(
    chartRef,
    {
      ...convertedOptions,
      series,
      yAxis,
      graphic: trendCursors,
    },
    settings
  );

  return (
    <div className='base-chart-container'>
      <Resizable
        height={height}
        width={chartWidth}
        onResize={onResize}
        axis='x'
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
      >
        <HotKeys keyMap={keyMap} handlers={handlers} style={{ position: 'relative' }}>
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
      <div style={{ height, width: width - chartWidth }}>
        <Legend series={series} graphic={trendCursors} />
      </div>
    </div>
  );
};

export default Chart;
