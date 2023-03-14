import { currentTimeStyle, timelineStyle } from '../styles';
import { getFormattedDateTime } from './dateTimeUtils';
import {
  getCurrentTimeIndicator,
  getDisplayForAvailableVideo,
  getDisplayForVideoOnEdge,
  getEndTimeIndicator,
  getStartTimeIndicator,
  getTimelineForProgressBar,
  getVideoProgressHolder,
} from './getDisplayForCustomProgressBar';

it('should return current time indicator html', () => {
  const currentTimeIndicatorId = 'cti-id';
  const expectedResult = `<div class='currentTimeIndicator' id='${currentTimeIndicatorId}' style='${currentTimeStyle}'>${getFormattedDateTime(
    new Date(1665583620000)
  )}</div>`;
  expect(getCurrentTimeIndicator(currentTimeIndicatorId, 1665583620000)).toEqual(expectedResult);
});

it('should return video timeline progress bar html', () => {
  const timerangesWithSource = [
    { start: 1630005300000, end: 1630005400000, src: 'mockOnDemandURL-1' },
    { start: 1630005400000, end: 1630005500000, src: 'mockOnDemandURL-2' },
    { start: 1630005800000, end: 1630005850000, src: 'mockOnDemandURL-3' },
  ];
  const timerangesForVideoOnEdge = [
    { start: 1630005400000, end: 1630005600000 },
    { start: 1630005800000, end: 1630005900000 },
  ];

  const timelineId = 'timeline-id';
  const playProgressId = 'playprogress-id';
  const startTimestamp = 1630005300000;
  const endTimestamp = 1630005900000;
  const expectedResult = `<div id='${timelineId}' style='${timelineStyle} '>${getDisplayForAvailableVideo(
    timerangesWithSource,
    startTimestamp,
    endTimestamp
  )}${getDisplayForVideoOnEdge(timerangesForVideoOnEdge, startTimestamp, endTimestamp)}${getVideoProgressHolder(
    playProgressId
  )}${getStartTimeIndicator(startTimestamp)}${getEndTimeIndicator(endTimestamp)}</div>`;
  expect(
    getTimelineForProgressBar(
      timelineId,
      playProgressId,
      timerangesWithSource,
      timerangesForVideoOnEdge,
      1630005300000,
      1630005900000
    )
  ).toEqual(expectedResult);
});
