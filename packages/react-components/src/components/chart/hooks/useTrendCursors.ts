import { UseTrendCursorsProps } from '../types';
import useDataStore from '../../../store';
import handleResize from '../utils/handleResize';
import handleSync from '../utils/handleSync';
import useTrendCursorsEvents from './useTrendCursorsEvents';

const useTrendCursors = ({
  ref,
  graphic,
  size,
  isInCursorAddMode,
  setGraphic,
  series,
  chartId,
  viewport,
  groupId,
  onContextMenu,
}: UseTrendCursorsProps) => {
  // for debugging purposes
  console.log(`useTrendCursors for chart id : ${chartId}`);

  const isInSyncMode = useDataStore((state) => (groupId ? !!state.trendCursorGroups[groupId] : false));

  // hook for handling all user events
  const { onContextMenuClickHandler } = useTrendCursorsEvents({
    ref,
    graphic,
    size,
    isInCursorAddMode,
    setGraphic,
    viewport,
    series,
    isInSyncMode,
    groupId,
    onContextMenu,
  });

  // for handling the resize of chart
  handleResize({ series, size, graphic, setGraphic, viewport, ref });

  // handling the trend cursor sync mode
  handleSync({ ref, isInSyncMode, graphic, setGraphic, viewport, series, size, groupId });

  return { onContextMenuClickHandler };
};

export default useTrendCursors;
