import { Colorizer } from '@iot-app-kit/core-util';
import useDataStore from '../../../store';
import useHandleResize from './resize/useHandleResize';
import useHandleSync from './sync/useHandleSync';
import useTrendCursorsEvents from './mouseEvents/useTrendCursorsEvents';
import { useState } from 'react';
import { useHandleViewport } from './viewport/useHandleViewport';

import { DEBUG_TREND_CURSORS } from './constants';
import { UseTrendCursorsProps } from './types';
import { YAXisOption } from 'echarts/types/dist/shared';
import { useHandleYMinMax } from './yMinMax/useHandleYMinMax';
import { useHandleSeries } from './series/useHandleSeries';
import { useHandleChartOptions } from './chartOptions/handleOptions';
import { KeyMap } from 'react-hotkeys';

const TRENDCURSOR_COLOR_PALETTE = ['#7492e7', '#da7596', '#2ea597', '#a783e1', '#e07941'];

const useTrendCursors = ({
  chartRef,
  size,
  series,
  chartId,
  viewportInMs,
  groupId,
  onContextMenu,
  initialGraphic,
  visualization,
  yAxisOptions,
  significantDigits,
}: UseTrendCursorsProps & {
  yAxisOptions: {
    yAxis: YAXisOption[];
  };
}) => {
  if (DEBUG_TREND_CURSORS) {
    // for debugging purposes
    console.log(`useTrendCursors for chart id : ${chartId}`);
  }

  const isInSyncMode = useDataStore((state) => (groupId ? !!state.trendCursorGroups[groupId] : false));
  const [graphic, setGraphic] = useState(initialGraphic ?? []);
  const [isInCursorAddMode, setIsInCursorAddMode] = useState(false);

  const colorer = Colorizer(TRENDCURSOR_COLOR_PALETTE);
  const existingColors = graphic.map((g) => g.color).filter((color): color is string => color != null);
  colorer.remove(existingColors);

  // hook for handling all user events
  const { onContextMenuClickHandler } = useTrendCursorsEvents({
    chartRef,
    graphic,
    size,
    isInCursorAddMode,
    setGraphic,
    series,
    isInSyncMode,
    groupId,
    onContextMenu,
    visualization,
    significantDigits,
    getColor: colorer.next,
  });

  // for handling the resize of chart
  useHandleResize({ series, size, graphic, setGraphic, chartRef, visualization, significantDigits });

  // handling the trend cursor sync mode
  useHandleSync({
    chartRef,
    isInSyncMode,
    graphic,
    setGraphic,
    series,
    size,
    groupId,
    visualization,
    significantDigits,
    getColor: colorer.next,
  });

  useHandleViewport({ graphic, setGraphic, chartRef, series, visualization, significantDigits, viewportInMs, size });

  useHandleYMinMax({ graphic, setGraphic, chartRef, series, visualization, significantDigits, yAxisOptions });

  useHandleSeries({ graphic, setGraphic, chartRef, series, visualization, significantDigits });

  useHandleChartOptions({ graphic, setGraphic, chartRef, series, visualization, significantDigits });

  const trendCursorKeyMap: KeyMap = {
    commandDown: { sequence: 't', action: 'keydown' },
    commandUp: { sequence: 't', action: 'keyup' },
  };

  const trendCursorHandlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
  };

  const orderedTrendCursors = graphic.sort((a, b) => a.timestampInMs - b.timestampInMs);

  return { onContextMenuClickHandler, trendCursorKeyMap, trendCursorHandlers, trendCursors: orderedTrendCursors };
};

export default useTrendCursors;
