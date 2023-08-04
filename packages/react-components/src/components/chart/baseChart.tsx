import React, { SyntheticEvent, useMemo, useState } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { convertOptions } from './converters/convertOptions';
import { ElementEvent } from 'echarts';
import { useSeriesAndYAxis } from './converters/convertSeriesAndYAxis';
import { HotKeys, KeyMap } from 'react-hotkeys';
import useTrendCursors from './hooks/useTrendCursors';
import { calculateYMaxMin } from './utils/getInfo';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Legend from './legend/legend';
import { CHART_RESIZE_INITIAL_FACTOR, CHART_RESIZE_MAX_FACTOR, CHART_RESIZE_MIN_FACTOR } from './eChartsConstants';
import { v4 as uuid } from 'uuid';
import { useChartStyleSettings } from './converters/convertStyles';
import './chart.css';
import ChartContextMenu, { Action } from './contextMenu/ChartContextMenu';

const keyMap: KeyMap = {
  commandDown: { sequence: 'command', action: 'keydown' },
  commandUp: { sequence: 'command', action: 'keyup' },
};

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size = { width: 500, height: 500 }, ...options }: ChartOptions) => {
  const { isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);

  const [styleSettingsMap] = useChartStyleSettings(dataStreams, options);

  const chartId = options?.id ?? `chart-${uuid()}`;

  const [trendCursors, setTrendCursors] = useState(options.graphic ?? []);
  const [isInCursorAddMode, setIsInCursorAddMode] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const option = {
    ...convertOptions({
      ...options,
      viewport,
      queries,
      size,
    }),
    graphic: trendCursors,
  };

  const [width, setWidth] = useState(size.width * CHART_RESIZE_INITIAL_FACTOR);
  const onResize = (_event: SyntheticEvent, data: ResizeCallbackData) => {
    setWidth(data.size.width);
  };

  const { ref, chartRef } = useECharts({
    option,
    loading: isLoading,
    size: { width, height: size.height },
    theme: options?.theme,
    groupId: options?.groupId,
  });

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
    size: { width, height: size.height },
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

  return (
    <div className='base-chart-container'>
      <Resizable
        height={size.height}
        width={width}
        onResize={onResize}
        axis='x'
        minConstraints={[size.width * CHART_RESIZE_MIN_FACTOR, size.height]}
        maxConstraints={[size.width * CHART_RESIZE_MAX_FACTOR, size.height]}
      >
        <HotKeys keyMap={keyMap} handlers={handlers} style={{ position: 'relative' }}>
          <div ref={ref} className='base-chart-element' style={{ height: size.height, width: width }} />
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
      <div style={{ height: size.height, width: size.width - width }}>
        <Legend series={series} graphic={trendCursors} />
      </div>
    </div>
  );
};

export default Chart;
