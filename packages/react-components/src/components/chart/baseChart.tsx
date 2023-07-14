import React, { useMemo, useState } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './useVisualizedDataStreams';
import { convertOptions } from './converters/convertOptions';
import { SeriesOption, YAXisComponentOption } from 'echarts';
import { convertYAxis } from './converters/convertAxis';
import { convertSeriesAndYAxis, reduceSeriesAndYAxis } from './converters/convertSeriesAndYAxis';
import { HotKeys, KeyMap } from 'react-hotkeys';
import useTrendCursors from './useTrendCursors';
import { calculateYMaxMin } from './utils/getInfo';

const keyMap: KeyMap = {
  commandDown: { sequence: 'command', action: 'keydown' },
  commandUp: { sequence: 'command', action: 'keyup' },
};

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size, ...options }: ChartOptions) => {
  const { isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);
  const { axis } = options;
  const defaultSeries: SeriesOption[] = [];
  const defaultYAxis: YAXisComponentOption[] = [convertYAxis(axis)];

  const { series, yAxis, yMin, yMax } = useMemo(() => {
    const { series, yAxis } = dataStreams
      .map(convertSeriesAndYAxis(options as ChartOptions))
      .reduce(reduceSeriesAndYAxis, { series: defaultSeries, yAxis: defaultYAxis });
    const { yMax, yMin } = calculateYMaxMin(series);
    const updatedYAxis = yAxis.map((y) => ({ ...y, min: yMin, max: yMax }));
    return { series, yAxis: updatedYAxis, yMin, yMax };
  }, [dataStreams]);

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

  const { ref } = useECharts({
    option,
    loading: isLoading,
    size,
    theme: options?.theme,
  });

  useTrendCursors(
    ref,
    trendCursors,
    size,
    isInCursorAddMode,
    setTrendCursors,
    series,
    yMax,
    yMin,
    viewport,
    options.theme
  );

  const handlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div ref={ref} style={{ height: size.height, width: size.width }} />
    </HotKeys>
  );
};

export default Chart;
