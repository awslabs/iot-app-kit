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
import { getVisibleData } from './dataFilters';
import { getDataPoints } from './getDataPoints';
import { isNumberDataStream } from './predicates';

const liveDataTimeBuffer = 1500;

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
  if (!audioAlertPlayer) {
    return tempAudioAlerts;
  }
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
  audioAlertPlayer: AudioAlertPlayer | undefined;
}): Map<Threshold | string, AudioAlert> | undefined => {
  if (!annotations || audioAlertPlayer === undefined) {
    return undefined;
  }
  // should this only apply to visualizations with numerical values?
  const numberStreams: DataStream[] = dataStreams.filter(isNumberDataStream);
  const thresholds = getThresholds(annotations);
  numberStreams.forEach((dataStream: DataStream) => {
    // audio alerts are only applied to live data
    if (isLiveData(viewport)) {
      const allPoints = getVisibleData(getDataPoints(dataStream, dataStream.resolution), viewport);
      if (allPoints.length != 0) {
        const latestPoint = allPoints[allPoints.length - 1];
        const breachedThresh = breachedThreshold({
          value: latestPoint.y,
          date: new Date(latestPoint.x),
          thresholds: thresholds,
          dataStreams: [],
          dataStream: dataStream as SynchroChartsDataStream,
        });
        if (breachedThresh != undefined) {
          console.log('play');
          if (audioAlerts) {
            audioAlerts.get(breachedThresh.id ?? breachedThresh)?.play();
          } else {
            const tempAudioAlerts = audioAlerts ?? initializeAudioAlerts(audioAlerts, audioAlertPlayer, thresholds);
            tempAudioAlerts.get(breachedThresh.id ?? breachedThresh)?.play();
            audioAlerts = audioAlerts ?? tempAudioAlerts;
          }
        }
      }
    }
  });
  return audioAlerts;
};
