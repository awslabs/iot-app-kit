import {
  currentTimeStyle,
  edgeTimeBlockStyle,
  endTimeStyle,
  progressBarStyle,
  progressPositionStyle,
  startTimeStyle,
  timeblockStyle,
  timelineStyle,
} from '../styles';
import { VideoTimeRanges, VideoTimeRangesWithSource } from '../types';
import { getFormattedDateTime } from './dateTimeUtils';

export const getCurrentTimeIndicator = (currentTimeIndicatorId: string, startTimestamp: number) => {
  return `<div class='currentTimeIndicator' id='${currentTimeIndicatorId}' style='${currentTimeStyle}'>${getFormattedDateTime(
    new Date(startTimestamp)
  )}</div>`;
};

export const getTimelineForProgressBar = (
  timelineId: string,
  playProgressId: string,
  timerangesWithSource: VideoTimeRangesWithSource,
  timerangesForVideoOnEdge: VideoTimeRanges,
  startTimestamp: number,
  endTimestamp: number
) => {
  return `<div id='${timelineId}' style='${timelineStyle} '>${getDisplayForAvailableVideo(
    timerangesWithSource,
    startTimestamp,
    endTimestamp
  )}${getDisplayForVideoOnEdge(timerangesForVideoOnEdge, startTimestamp, endTimestamp)}${getVideoProgressHolder(
    playProgressId
  )}${getStartTimeIndicator(startTimestamp)}${getEndTimeIndicator(endTimestamp)}</div>`;
};

export const getStartTimeIndicator = (startTimestamp: number) => {
  return `<div class='startTimeIndicator' style='${startTimeStyle}'>${getFormattedDateTime(
    new Date(startTimestamp)
  )}</div>`;
};

export const getEndTimeIndicator = (endTimestamp: number) => {
  return `<div class='endTimeIndicator' style='${endTimeStyle}'>${getFormattedDateTime(new Date(endTimestamp))}</div>`;
};

export const getVideoProgressHolder = (playProgressId: string) => {
  return `<div className='vjs-progress-holder vjs-slider vjs-slider-horizontal' style='${progressBarStyle}'><div id='${playProgressId}' className='indicator draggable' style='${progressPositionStyle}'></div></div>`;
};

// Get the blocks when video is available
export const getDisplayForAvailableVideo = (
  timerangesWithSource: VideoTimeRangesWithSource,
  startTime: number,
  endTime: number
) => {
  let videoPresentHtml = '';
  const totalTimeRange = endTime - startTime;
  timerangesWithSource.forEach((source) => {
    const percentage = ((source.end - source.start) / totalTimeRange) * 100;
    const shift = ((source.start - startTime) / totalTimeRange) * 100;
    videoPresentHtml += `<div class='timeblock' style='${timeblockStyle} width:${percentage}%; left:${shift}%;'></div>`;
  });
  return videoPresentHtml;
};

// Get the blocks when video is available on edge
export const getDisplayForVideoOnEdge = (
  timerangesForVideoOnEdge: VideoTimeRanges,
  startTime: number,
  endTime: number
) => {
  let videoOnEdgeHtml = '';
  const totalTimeRange = endTime - startTime;
  timerangesForVideoOnEdge.forEach((source) => {
    const percentage = ((source.end - source.start) / totalTimeRange) * 100;
    const shift = ((source.start - startTime) / totalTimeRange) * 100;
    videoOnEdgeHtml += `<div class='edgeTimeBlock' style='${edgeTimeBlockStyle} width:${percentage}%; left:${shift}%;'></div>`;
  });
  return videoOnEdgeHtml;
};
