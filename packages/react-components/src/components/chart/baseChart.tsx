import React, { SyntheticEvent, useMemo, useState } from 'react';
import { useECharts, useResizeableEChart, useGroupableEChart, useLoadableEChart, useEChartOptions } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { convertOptions } from './converters/convertOptions';
import { ElementEvent } from 'echarts';
import { useSeriesAndYAxis } from './converters/convertSeriesAndYAxis';
import { HotKeys, KeyMap } from 'react-hotkeys';
import useTrendCursors from './hooks/useTrendCursors';
import { Resizable } from 'react-resizable';
import Legend from './legend/legend';
import { useChartStyleSettings } from './converters/convertStyles';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';
import { useChartId } from './hooks/useChartId';

import './chart.css';

const keyMap: KeyMap = {
  commandDown: { sequence: 'command', action: 'keydown' },
  commandUp: { sequence: 'command', action: 'keyup' },
};

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size = { width: 500, height: 500 }, ...options }: ChartOptions) => {
  const { ref, chartRef } = useECharts({
    theme: options?.theme,
  });

  const chartId = useChartId(options.id);

  const { isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);

  const {
    width,
    height,
    chartWidth,
    onResize,
    minConstraints,
    maxConstraints
  } = useResizeableEChart(chartRef, size);

  useGroupableEChart(chartRef, options.groupId);
  useLoadableEChart(chartRef, isLoading)

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
  const { series } = useSeriesAndYAxis(chartRef, dataStreams, { styleSettings: styleSettingsMap, axis: options.axis });

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

  useEChartOptions(chartRef, {
    ...convertOptions({
      ...options,
      viewport,
      queries,
      size: {
        height,
        width
      },
    }),
    graphic: trendCursors,
  });

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
      <div style={{ height, width: chartWidth - width }}>
        <Legend series={series} graphic={trendCursors} />
      </div>
    </div>
  );
};

export default Chart;
