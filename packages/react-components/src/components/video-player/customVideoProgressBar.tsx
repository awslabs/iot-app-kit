import {
  getCurrentTimeIndicator,
  getTimelineForProgressBar,
} from './utils/getDisplayForCustomProgressBar';
import type { CustomVideoProgressBarProps } from './types';

export const customVideoProgressBar = (
  customProgressBarProps: CustomVideoProgressBarProps
) => {
  const {
    currentTimeIndicatorId,
    timelineId,
    playProgressId,
    timerangesWithSource,
    timerangesForVideoOnEdge,
    startTimestamp,
    endTimestamp,
  } = customProgressBarProps;
  return `${getCurrentTimeIndicator(
    currentTimeIndicatorId,
    startTimestamp
  )}${getTimelineForProgressBar(
    timelineId,
    playProgressId,
    timerangesWithSource,
    timerangesForVideoOnEdge,
    startTimestamp,
    endTimestamp
  )}`;
};
