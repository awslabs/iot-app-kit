import {
  Annotations,
  breachedThreshold,
  DataStream as SynchroChartsDataStream,
  getThresholds,
  MinimalViewPortConfig,
} from '@synchro-charts/core';
import { DataStream } from '../data-module/types';
import { AudioAlert } from './types';
import { leastSevere, liveDataTimeBufferMs } from './constants';
import { getVisibleData } from './dataFilters';
import { getDataPoints } from './getDataPoints';
import { Threshold } from './types';
import { viewportEndDate } from './viewport';
import { AudioAlertPlayer, calculateSeverity } from './audioAlertPlayer';

export const audioAlertPlayer = new AudioAlertPlayer();

// Returns true if viewport is in Live Mode or if viewport.end is past the current time and date
export const isLiveData = (viewport: MinimalViewPortConfig): boolean => {
  return viewportEndDate(viewport).getTime() + liveDataTimeBufferMs > Date.now();
};

// Plays audio alert if in live mode and newly pushed point breaches a threshold
export const playThresholdAudioAlert = ({
  dataStreams,
  viewport,
  annotations,
}: {
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
  annotations: Annotations | undefined;
}): Map<string, AudioAlert> | undefined => {
  if (!isLiveData(viewport)) {
    return;
  }
  const thresholds = getThresholds(annotations);
  if (thresholds.length === 0) {
    return;
  }

  // Audio alerts are only applied to live data
  dataStreams.forEach((dataStream: DataStream) => {
    const allVisiblePoints = getVisibleData(getDataPoints(dataStream, dataStream.resolution), viewport);
    if (allVisiblePoints.length === 0) {
      return;
    }
    const latestPoint = allVisiblePoints[allVisiblePoints.length - 1];
    const breachedThresh = breachedThreshold({
      value: latestPoint.y,
      date: new Date(latestPoint.x),
      thresholds: thresholds,
      dataStreams: [],
      dataStream: dataStream as SynchroChartsDataStream,
    }) as Threshold;
    if (breachedThresh !== undefined && breachedThresh.audioAlert !== undefined) {
      const severity = calculateSeverity(breachedThresh.severity ?? leastSevere);
      audioAlertPlayer.play({
        severity,
        volume: breachedThresh.audioAlert.volume,
        audioSrc: breachedThresh.audioAlert.audioSrc,
      });
    }
  });
};
