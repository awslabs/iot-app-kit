import useDataStore from '../../../store';
import useHandleResize from './resize/useHandleResize';
import useHandleSync from './sync/useHandleSync';
import useTrendCursorsEvents from './mouseEvents/useTrendCursorsEvents';
import { useMemo, useState } from 'react';
import { useHandleViewport } from './viewport/useHandleViewport';

import { DEBUG_TREND_CURSORS } from './constants';
import { UseTrendCursorsProps } from './types';

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
}: UseTrendCursorsProps) => {
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
  });

  // for handling the resize of chart
  useHandleResize({ series, size, graphic, setGraphic, chartRef, visualization });

  // handling the trend cursor sync mode
  useHandleSync({ chartRef, isInSyncMode, graphic, setGraphic, series, size, groupId, visualization });

  useHandleViewport({ graphic, setGraphic, viewportInMs, size, series, chartRef, visualization });

  return useMemo(() => {
    const hotKeyHandlers = {
      commandDown: () => setIsInCursorAddMode(true),
      commandUp: () => setIsInCursorAddMode(false),
    };
    return { onContextMenuClickHandler, hotKeyHandlers, trendCursors: graphic };
  }, [graphic, onContextMenuClickHandler]);
};

export default useTrendCursors;
