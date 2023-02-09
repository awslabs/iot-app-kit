import { getVideoProgressPercentage, getVideoProgressSeekTime, getVideoProgressTooltip } from './videoProgressUtils';

it('should return video progress percentage', () => {
  expect(getVideoProgressPercentage(1665583620000, 20, 1665583520000, 1665583720000)).toEqual(60);
});

it('should return video seek time according to percentage', () => {
  expect(getVideoProgressSeekTime(60, 1665583520000, 1665583720000)).toEqual(1665583640000);
});

// TimezoneOffset is included to make sure that output is calucalted as expected result without timezone issue during test
it('should set valid tooltip on video progress', () => {
  const seekTime = 1665583620000 + new Date().getTimezoneOffset() * 60000;
  const startTime = 1665583520000 + new Date().getTimezoneOffset() * 60000;
  expect(getVideoProgressTooltip(seekTime, startTime)).toEqual(`10/12\n14:07:00`);
});

it('should set tooltip to empty text if cursor before start time', () => {
  expect(getVideoProgressTooltip(1665583420000, 1665583520000)).toEqual('');
});
