import { Viewport } from '@iot-app-kit/core';
import { PLAYBACKMODE_LIVE, PLAYBACKMODE_ON_DEMAND } from '../constants';
import { getFormattedDateTime, getNewSeekTime, getStartAndEndTimeForVideo } from './dateTimeUtils';

// TimezoneOffset is included to make sure that output is calucalted as expected result without timezone issue during test
it('should format the Date to DateTime value', () => {
  const rawDate = new Date(1665583620000 + new Date().getTimezoneOffset() * 60000);
  expect(getFormattedDateTime(rawDate)).toEqual(`10/12\n14:07:00`);
});

it('should return correct seek time', () => {
  expect(
    getNewSeekTime(
      10,
      {
        x: 2,
        width: 200,
        height: 10,
        y: 0,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        toJSON: jest.fn(),
      },
      1665583620000,
      1665583720000
    )
  ).toEqual(1665583624000);
});

it('should return the start and end time for on-demand mode', () => {
  const startTime = new Date(1665583620000 + new Date().getTimezoneOffset() * 60000);
  const endTime = new Date(1665583640000 + new Date().getTimezoneOffset() * 60000);
  const viewport: Viewport = { start: startTime, end: endTime };
  expect(getStartAndEndTimeForVideo(viewport, PLAYBACKMODE_ON_DEMAND)).toEqual({ start: startTime, end: endTime });
});

it('should return the start and end time for live mode', () => {
  const viewport: Viewport = { duration: '0' };
  const response = getStartAndEndTimeForVideo(viewport, PLAYBACKMODE_LIVE);
  expect(response.start).toBeTruthy();
  expect(response.end).toEqual(undefined);
});
