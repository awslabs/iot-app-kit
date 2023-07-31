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
  yMax,
  yMin,
  chartId,
  viewport,
  groupId,
}: UseTrendCursorsProps) => {
  // for debugging purposes
  console.log(`useTrendCursors for chart id : ${chartId}`);

  const isInSyncMode = useDataStore((state) => (groupId ? !!state.trendCursorGroups[groupId] : false));

  // hook for handling all user events
  useTrendCursorsEvents({
    ref,
    graphic,
    size,
    isInCursorAddMode,
    setGraphic,
    viewport,
    series,
    yMin,
    yMax,
    isInSyncMode,
    groupId,
  });

  // for handling the resize of chart
  handleResize({ series, size, yMin, yMax, graphic, setGraphic, viewport });

  // handling the trend cursor sync mode
  handleSync({ ref, isInSyncMode, graphic, setGraphic, viewport, series, yMin, yMax, size, groupId });
};

export default useTrendCursors;
