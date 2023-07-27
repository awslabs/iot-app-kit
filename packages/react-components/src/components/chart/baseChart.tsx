import React, { SyntheticEvent, useState } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './useVisualizedDataStreams';
import { convertOptions } from './converters/convertOptions';
import { YAXisComponentOption } from 'echarts';
import { convertYAxis } from './converters/convertAxis';
import { HotKeys, KeyMap } from 'react-hotkeys';
import useTrendCursors from './useTrendCursors';
import { calculateYMaxMin } from './utils/getInfo';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Legend from './legend/legend';
import { CHART_RESIZE_INITIAL_FACTOR, CHART_RESIZE_MAX_FACTOR, CHART_RESIZE_MIN_FACTOR } from './eChartsConstants';

import { MultiYAxisLegend } from './legend/multiYAxis';
import { useDataStreamConverter } from './converters/useDataStreamConverter';
import { mapDataStreams } from './converters/mapDataStreams';
import { reduceDataStreams } from './converters/reduceDataStreams';
import { getInitialConvertedDataStream } from './converters/defaultConvertedDataStream';

import './chart.css';

const keyMap: KeyMap = {
  commandDown: { sequence: 'command', action: 'keydown' },
  commandUp: { sequence: 'command', action: 'keyup' },
};

const hasMultipleYAxis = (axis: YAXisComponentOption[]) => axis.length > 1;

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size = { width: 500, height: 500 }, ...options }: ChartOptions) => {
  const { isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);
  const { axis } = options;

  const {
    series,
    yAxis,
    legend,
  } = useDataStreamConverter(
    dataStreams,
    mapDataStreams(options),
    reduceDataStreams,
    getInitialConvertedDataStream({ yAxis: [convertYAxis(axis)] })
  );

  const { yMin: yMinTC, yMax: yMaxTC } = calculateYMaxMin(series);

  const [trendCursors, setTrendCursors] = useState(options.graphic ?? []);
  const [isInCursorAddMode, setIsInCursorAddMode] = useState(false);

  const option = {
    ...convertOptions({
      ...options,
      viewport,
      queries,
      size,
      seriesLength: series.length,
    }),
    series,
    yAxis,
    graphic: trendCursors,
  };

  const [width, setWidth] = useState(size.width * CHART_RESIZE_INITIAL_FACTOR);
  const onResize = (_event: SyntheticEvent, data: ResizeCallbackData) => {
    setWidth(data.size.width);
  };

  const { ref } = useECharts({
    option,
    loading: isLoading,
    size: { width, height: size.height },
    theme: options?.theme,
  });

  useTrendCursors(
    ref,
    trendCursors,
    { width, height: size.height },
    isInCursorAddMode,
    setTrendCursors,
    series,
    yMaxTC,
    yMinTC,
    viewport,
    options.theme
  );

  const handlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
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
          <HotKeys keyMap={keyMap} handlers={handlers}>
          <div className='base-chart'>
            { hasMultipleYAxis(yAxis) && <MultiYAxisLegend {...legend} /> }
            <div ref={ref} className='base-chart-element' style={{ height: size.height, width: width }} />
          </div>
          </HotKeys>
      </Resizable>
      <div style={{ height: size.height, width: size.width - width }}>
        <Legend series={series} graphic={trendCursors} {...legend} />
      </div>
    </div>
  );
};

export default Chart;
