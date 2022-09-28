import { DateRangePickerProps } from '@awsui/components-react';
import { Viewport } from '@iot-app-kit/core';
import { VideoData } from '@iot-app-kit/source-iottwinmaker';

export type IVideoPlayerProps = {
  videoData: VideoData;
  viewport: Viewport;
};

export type IVideoPlayerState = {
  playbackMode?: 'LIVE' | 'ON_DEMAND';
};

export type IVideoUploadRequestProps = {
  videoData: VideoData;
};

export type IVideoUploadRequestState = {
  videoUploadDateRange?: DateRangePickerProps.AbsoluteValue | DateRangePickerProps.RelativeValue;
};

export type VideoTimeRanges = Array<{ start: number; end: number }>;
export type VideoTimeRangesWithSource = Array<{ start: number; end: number; src: string }>;

export type CustomVideoProgressBarProps = {
  currentTimeIndicatorId: string;
  timelineId: string;
  playProgressId: string;
  timerangesWithSource: VideoTimeRangesWithSource;
  timerangesForVideoOnEdge: VideoTimeRanges;
  startTimestamp: number;
  endTimestamp: number;
};
