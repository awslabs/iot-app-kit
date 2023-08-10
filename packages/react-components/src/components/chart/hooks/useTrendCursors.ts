import { UseTrendCursorsProps } from '../types';
import useDataStore from '../../../store';
import handleResize from '../utils/handleResize';
import handleSync from '../utils/handleSync';
import useTrendCursorsEvents from './useTrendCursorsEvents';
import { useState } from 'react';
import { handleViewport } from '../utils/handleViewport';

const useTrendCursors = ({
  ref,
  size,
  series,
  chartId,
  viewportInMs,
  groupId,
  onContextMenu,
  initialGraphic,
}: UseTrendCursorsProps) => {
  // for debugging purposes
  console.log(`useTrendCursors for chart id : ${chartId}`);

  const isInSyncMode = useDataStore((state) => (groupId ? !!state.trendCursorGroups[groupId] : false));
  const [graphic, setGraphic] = useState(initialGraphic ?? []);
  const [isInCursorAddMode, setIsInCursorAddMode] = useState(false);

  // hook for handling all user events
  const { onContextMenuClickHandler } = useTrendCursorsEvents({
    ref,
    graphic,
    size,
    isInCursorAddMode,
    setGraphic,
    viewportInMs,
    series,
    isInSyncMode,
    groupId,
    onContextMenu,
  });

  // for handling the resize of chart
  handleResize({ series, size, graphic, setGraphic, viewportInMs, ref });

  // handling the trend cursor sync mode
  handleSync({ ref, isInSyncMode, graphic, setGraphic, viewportInMs, series, size, groupId });

  const hotKeyHandlers = {
    commandDown: () => setIsInCursorAddMode(true),
    commandUp: () => setIsInCursorAddMode(false),
  };

  handleViewport({ graphic, setGraphic, viewportInMs, size });

  return { onContextMenuClickHandler, hotKeyHandlers, trendCursors: graphic };
};

export default useTrendCursors;
