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
  return { onContextMenuClickHandler, trendCursorKeyMap, trendCursorHandlers, trendCursors: graphic };
};

export default useTrendCursors;
