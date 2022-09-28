import { CustomVideoProgressBarProps } from './types';
import { getCurrentTimeIndicator, getTimelineForProgressBar } from './utils/getDisplayForCustomProgressBar';

export const customVideoProgressBar = (customProgressBarProps: CustomVideoProgressBarProps) => {
  const {
    currentTimeIndicatorId,
    timelineId,
    playProgressId,
    timerangesWithSource,
    timerangesForVideoOnEdge,
    startTimestamp,
    endTimestamp,
  } = customProgressBarProps;
  return `${getCurrentTimeIndicator(currentTimeIndicatorId, startTimestamp)}${getTimelineForProgressBar(
    timelineId,
    playProgressId,
    timerangesWithSource,
    timerangesForVideoOnEdge,
    startTimestamp,
    endTimestamp
  )}`;
};
