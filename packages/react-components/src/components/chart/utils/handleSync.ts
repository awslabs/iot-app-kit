import { calculateSyncDelta } from './handleSyncTrendCursors';
import { getInstanceByDom } from 'echarts';
import { getNewTrendCursor, onDragUpdateTrendCursor } from './getTrendCursor';
import { calculateXFromTimestamp } from './getInfo';
import useDataStore from '../../../store';
import { UseSyncProps } from '../types';

const handleSync = ({ ref, isInSyncMode, graphic, setGraphic, viewport, series, size, groupId }: UseSyncProps) => {
  const syncedTrendCursors = useDataStore((state) => state.trendCursorGroups[groupId ?? '']);

  if (ref.current && isInSyncMode && syncedTrendCursors) {
    const { toBeAdded, toBeDeleted, toBeUpdated } = calculateSyncDelta({
      syncedTrendCursors,
      graphic,
    });

    // if no changes, we skip setting the state
    if (toBeAdded.length || toBeDeleted.length || toBeUpdated.length) {
      const chart = getInstanceByDom(ref.current);

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
              viewport,
              x: calculateXFromTimestamp(timestamp, size, viewport),
              ref,
            })
          );
        });
      }

      // update if any of the timestamps are different i.e. the TC is dragged
      if (toBeUpdated.length) {
        toBeUpdated.forEach((updateTC) => {
          graphic[updateTC.index] = onDragUpdateTrendCursor({
            graphic: graphic[updateTC.index],
            posX: calculateXFromTimestamp(updateTC.newTimestamp, size, viewport),
            timeInMs: updateTC.newTimestamp,
            size,
            series,
            ref,
          });
        });
      }

      // if any of the TCs are deleted
      if (toBeDeleted.length) {
        toBeDeleted.forEach((dTc) => {
          graphic[dTc.index].$action = 'remove';
          // Echarts will throw error if children are not empty
          graphic[dTc.index].children = [];
          chart?.setOption({ graphic });
          graphic.splice(dTc.index, 1);
        });
      }

      // update all graphics at once
      setGraphic([...graphic]);
    }
  }
};

export default handleSync;
