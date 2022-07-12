import {
  Annotations,
  breachedThreshold,
  DataStream as SynchroChartsDataStream,
  getThresholds,
  MinimalViewPortConfig,
  Threshold,
} from '@synchro-charts/core';
import { DataStream } from '../data-module/types';

import { AudioAlert } from './audioAlert';
import { AudioAlertPlayer } from './audioAlertPlayer';
import { liveDataTimeBuffer } from './constants';
import { getVisibleData } from './dataFilters';
import { getDataPoints } from './getDataPoints';
import { isNumberDataStream } from './predicates';


const isLiveData = (viewport: MinimalViewPortConfig): boolean => {
  // duration in viewport if in live mode
  if ('duration' in viewport) {
    return true;
  } else {
    // if the viewport is past the current time then we expect audio alerts to behave as if we're in live mode
    const endTimestamp = typeof viewport.end === 'string' ? new Date(viewport.end).getTime() : viewport.end.getTime();
    return endTimestamp + liveDataTimeBuffer > Date.now();
  }
};

export const initializeAudioAlerts = (
  audioAlerts: Map<Threshold | string, AudioAlert> | undefined,
  audioAlertPlayer: AudioAlertPlayer | undefined,
  thresholds: Threshold[]
): Map<Threshold | string, AudioAlert> => {
  const tempAudioAlerts = audioAlerts ?? new Map<Threshold | string, AudioAlert>();
  thresholds.forEach((threshold) => {
    if (!tempAudioAlerts.has(threshold.id ?? threshold) && audioAlertPlayer) {
      tempAudioAlerts.set(
        threshold.id ?? threshold,
        new AudioAlert({
          audioAlertPlayer: audioAlertPlayer,
          isMuted: false,
          volume: 1.0,
          severity: threshold.severity,
        })
      );
    }
  });
  return tempAudioAlerts;
};

export const playThresholdAudioAlert = ({
  dataStreams,
  viewport,
  annotations,
  audioAlerts,
  audioAlertPlayer,
}: {
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
  annotations: Annotations | undefined;
  audioAlerts: Map<Threshold | string, AudioAlert> | undefined;
  audioAlertPlayer: AudioAlertPlayer;
}): Map<Threshold | string, AudioAlert> | undefined => {
  const thresholds = getThresholds(annotations);
  if (thresholds.length === 0) {
    return;
  }
  const numberStreams: DataStream[] = dataStreams.filter(isNumberDataStream);
  numberStreams.forEach((dataStream: DataStream) => {
    // audio alerts are only applied to live data
    if (isLiveData(viewport)) {
      const allVisiblePoints = getVisibleData(getDataPoints(dataStream, dataStream.resolution), viewport);
      if (allVisiblePoints.length != 0) {
        const latestPoint = allVisiblePoints[allVisiblePoints.length - 1];
        const breachedThresh = breachedThreshold({
          value: latestPoint.y,
          date: new Date(latestPoint.x),
          thresholds: thresholds,
          dataStreams: [],
          dataStream: dataStream as SynchroChartsDataStream,
        });
        if (breachedThresh != undefined) {
          const tempAudioAlerts = audioAlerts ?? initializeAudioAlerts(audioAlerts, audioAlertPlayer, thresholds);
          tempAudioAlerts.get(breachedThresh.id ?? breachedThresh)?.play();
          audioAlerts = audioAlerts ?? tempAudioAlerts;
        }
      }
    }
  });
  return audioAlerts;
};
