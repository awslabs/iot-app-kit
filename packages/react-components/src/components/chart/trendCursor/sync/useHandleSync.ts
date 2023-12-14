import { calculateSyncDelta } from './calculateSyncDelta';
import { getNewTrendCursor } from '../getTrendCursor/getTrendCursor';
import { calculateXFromTimestamp } from '../calculations/calculations';
import useDataStore from '../../../../store';

import { UseSyncProps } from '../types';
import { onDragUpdateTrendCursor } from '../mouseEvents/handlers/drag/update';

const useHandleSync = ({
  chartRef,
  isInSyncMode,
  graphic,
  setGraphic,
  series,
  size,
  groupId,
  visualization,
  significantDigits,
  getColor,
}: UseSyncProps) => {
  const syncedTrendCursors = useDataStore((state) => state.trendCursorGroups[groupId ?? '']);

  if (chartRef && isInSyncMode && syncedTrendCursors) {
    const { toBeAdded, toBeDeleted, toBeUpdated } = calculateSyncDelta({
      syncedTrendCursors,
      graphic,
    });

    // if no changes, we skip setting the state
    if ((toBeAdded.length || toBeDeleted.length || toBeUpdated.length) && series.length > 0) {
      // add a new trend cursor
      if (toBeAdded.length) {
        toBeAdded.forEach((tcId) => {
          const timestamp = (syncedTrendCursors ?? {})[tcId].timestamp;

          const newTC = getNewTrendCursor({
            tcId,
            timestamp,
            size,
            series,
            x: calculateXFromTimestamp(timestamp, chartRef),
            chartRef,
            visualization,
            significantDigits,
            color: getColor(),
          });
          if (newTC) {
            graphic.push(newTC);
            setGraphic([...graphic]);
          }
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
            significantDigits,
          });
        });
        // moved the setGraphic to per operation, given adding new tc operation needed to updated with if not undefined check
        // also it is one operation per cycle, so only one setGraphic will be called per operation
        setGraphic([...graphic]);
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
        // moved the setGraphic to per operation, given adding new tc operation needed to updated with if not undefined check
        // also it is one operation per cycle, so only one setGraphic will be called per operation
        setGraphic([...graphic]);
      }
    }
  }
};

export default useHandleSync;
