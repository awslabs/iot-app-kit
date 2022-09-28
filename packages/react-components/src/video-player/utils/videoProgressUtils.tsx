import { getFormattedDateTime } from './dateTimeUtils';

export const getVideoProgressPercentage = (
  currentStart: number,
  currentTime: number,
  startTimeStamp: number,
  endTimeStamp: number
) => {
  return ((currentStart + currentTime * 1000 - startTimeStamp) / (endTimeStamp - startTimeStamp)) * 100;
};

export const getVideoProgressSeekTime = (percentage: number, startTimeStamp: number, endTimeStamp: number) => {
  return startTimeStamp + (percentage * (endTimeStamp - startTimeStamp)) / 100;
};

export const getVideoProgressTooltip = (seekTime: number, startTime: number) => {
  let tooltipText = '';
  if (seekTime >= startTime) {
    tooltipText = getFormattedDateTime(new Date(seekTime));
  }
  return tooltipText;
};
