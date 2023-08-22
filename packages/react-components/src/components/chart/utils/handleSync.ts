import { calculateSyncDelta } from './handleSyncTrendCursors';
import { getNewTrendCursor, onDragUpdateTrendCursor } from './getTrendCursor';
import { calculateXFromTimestamp } from './trendCursorCalculations';
import useDataStore from '../../../store';
import { UseSyncProps } from '../types';

const handleSync = ({
  chartRef,
  isInSyncMode,
  graphic,
  setGraphic,
  series,
  size,
  groupId,
  visualization,
}: UseSyncProps) => {
  const syncedTrendCursors = useDataStore((state) => state.trendCursorGroups[groupId ?? '']);

  if (chartRef && isInSyncMode && syncedTrendCursors) {
    const { toBeAdded, toBeDeleted, toBeUpdated } = calculateSyncDelta({
      syncedTrendCursors,
      graphic,
    });

    // if no changes, we skip setting the state
    if (toBeAdded.length || toBeDeleted.length || toBeUpdated.length) {
      // add a new trend cursor
      if (toBeAdded.length) {
        toBeAdded.forEach((tcId) => {
          const timestamp = (syncedTrendCursors ?? {})[tcId].timestamp;
          graphic.push(
            getNewTrendCursor({
              tcId,
              timestamp,
              size,
              tcHeaderColorIndex: (syncedTrendCursors ?? {})[tcId].tcHeaderColorIndex,
              series,
              x: calculateXFromTimestamp(timestamp, chartRef),
              chartRef,
              visualization,
            })
          );
        });
      }

      // update if any of the timestamps are different i.e. the TC is dragged
      if (toBeUpdated.length) {
        toBeUpdated.forEach((updateTC) => {
          graphic[updateTC.index] = onDragUpdateTrendCursor({
            graphic: graphic[updateTC.index],
            posX: calculateXFromTimestamp(updateTC.newTimestamp, chartRef),
            timeInMs: updateTC.newTimestamp,
            size,
            series,
            chartRef,
            visualization,
          });
        });
      }

      // if any of the TCs are deleted
      if (toBeDeleted.length) {
        toBeDeleted.forEach((dTc) => {
          graphic[dTc.index].$action = 'remove';
          // Echarts will throw error if children are not empty
          graphic[dTc.index].children = [];
          chartRef.current?.setOption({ graphic });
          graphic.splice(dTc.index, 1);
        });
      }

      // update all graphics at once
      setGraphic([...graphic]);
    }
  }
};

export default handleSync;
