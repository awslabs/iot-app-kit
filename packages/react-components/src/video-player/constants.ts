import { VideoJsPlayerOptions } from 'video.js';

export const requestVideoButtonLabel = 'Request Video';
export const noVideoAvailableMessage = 'There is no video available at this time.';
export const videoOnEdgeMessage =
  'Video is available on edge at this time but is not available for playback. Request video for playback.';
export const html5NotSupportedMessage = 'Your browser does not support HTML5. Please upgrade your browser.';
export const PLAYBACKMODE_LIVE = 'LIVE';
export const PLAYBACKMODE_ON_DEMAND = 'ON_DEMAND';
export const videoJsOptions: VideoJsPlayerOptions = {
  autoplay: true,
  controls: true,
  fill: true,
  liveui: true,
  fluid: true,
  playbackRates: [0.5, 1, 1.5, 2],
  preload: 'auto',
  sources: [],
  controlBar: {
    volumePanel: {
      inline: false,
    },
    children: [
      'playToggle',
      'progressControl',
      'volumePanel',
      'pictureInPictureToggle',
      'playbackRateMenuButton',
      'fullscreenToggle',
    ],
  },
};

export const i18nStrings = {
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next month',
  previousMonthAriaLabel: 'Previous month',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  formatRelativeRange: (e: { amount: number; unit: string }) => {
    const t = 1 === e.amount ? e.unit : `${e.unit}s`;
    return `Last ${e.amount} ${t}`;
  },
  formatUnit: (e: string, t: number) => (1 === t ? e : `${e}s`),
  dateTimeConstraintText: 'Range must be between 6 - 30 days. Use 24 hour format.',
  relativeModeTitle: 'Relative range',
  absoluteModeTitle: 'Absolute range',
  relativeRangeSelectionHeading: 'Choose a range',
  startDateLabel: 'Start date',
  endDateLabel: 'End date',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  clearButtonLabel: 'Clear',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
};
