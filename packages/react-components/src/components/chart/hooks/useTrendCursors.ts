import { UseTrendCursorsProps } from '../types';
import useDataStore from '../../../store';
import handleResize from '../utils/handleResize';
import handleSync from '../utils/handleSync';
import useTrendCursorsEvents from './useTrendCursorsEvents';
import { useState } from 'react';
import { handleViewport } from '../utils/handleViewport';
import { DEBUG_TREND_CURSORS } from '../eChartsConstants';

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
  handleResize({ series, size, graphic, setGraphic, chartRef, visualization });

  // handling the trend cursor sync mode
  handleSync({ chartRef, isInSyncMode, graphic, setGraphic, series, size, groupId, visualization });

  const hotKeyHandlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
  };

  handleViewport({ graphic, setGraphic, viewportInMs, size, series, chartRef, visualization });

  return { onContextMenuClickHandler, hotKeyHandlers, trendCursors: graphic };
};

export default useTrendCursors;
