import { customVideoProgressBar } from './customVideoProgressBar';

it('should return custom video progress bar html', () => {
  const expectedResult = `<div class='currentTimeIndicator' id='currentTimeIndicatorId' style='margin-left:-75px;width:20px;margin-top:60px;position: absolute;pointer-events: none;'>8/26
19:15:00</div><div id='timelineId' style='background-color:rgba(0, 0, 0, 0.5); position: relative; min-height: 24px; height: 24px; width: 100%;margin-right:10px; '><div class='timeblock' style='position: absolute;background-color: rgb(21, 73, 90);height: 100%; width:16.666666666666664%; left:0%;'></div><div class='timeblock' style='position: absolute;background-color: rgb(21, 73, 90);height: 100%; width:16.666666666666664%; left:16.666666666666664%;'></div><div class='timeblock' style='position: absolute;background-color: rgb(21, 73, 90);height: 100%; width:8.333333333333332%; left:83.33333333333334%;'></div><div class='edgeTimeBlock' style='position: absolute;height: 100%;background: repeating-linear-gradient(45deg,#15495A,#15495A 4px,#000000 3px,#000000 7px); width:33.33333333333333%; left:16.666666666666664%;'></div><div class='edgeTimeBlock' style='position: absolute;height: 100%;background: repeating-linear-gradient(45deg,#15495A,#15495A 4px,#000000 3px,#000000 7px); width:16.666666666666664%; left:83.33333333333334%;'></div><div className='vjs-progress-holder vjs-slider vjs-slider-horizontal' style='position: absolute;width: 100%;height: 3px;background-color: rgba(255, 255, 255, 0.719);margin-top: 12px;'><div id='playProgressId' className='indicator draggable' style='background-color:rgb(77, 181, 247);position: absolute;width: 8px;height: 12px;border-radius: 5px;margin-top: -5px;left: -4px;pointer-events: none;'></div></div><div class='startTimeIndicator' style='margin-left:-15px;width:20px;margin-top:32px;position: absolute;pointer-events: none;'>8/26
19:15:00</div><div class='endTimeIndicator' style='width:20px;margin-top:32px;margin-left: auto;margin-right: 0;pointer-events: none;'>8/26
19:25:00</div></div>`;
  // TimezoneOffset is included to make sure that output is calucalted as expected result without timezone issue during test
  const timerangesWithSource = [
    {
      start: 1630005300000 + new Date().getTimezoneOffset() * 60000,
      end: 1630005400000 + new Date().getTimezoneOffset() * 60000,
      src: 'mockOnDemandURL-1',
    },
    {
      start: 1630005400000 + new Date().getTimezoneOffset() * 60000,
      end: 1630005500000 + new Date().getTimezoneOffset() * 60000,
      src: 'mockOnDemandURL-2',
    },
    {
      start: 1630005800000 + new Date().getTimezoneOffset() * 60000,
      end: 1630005850000 + new Date().getTimezoneOffset() * 60000,
      src: 'mockOnDemandURL-3',
    },
  ];
  const timerangesForVideoOnEdge = [
    {
      start: 1630005400000 + new Date().getTimezoneOffset() * 60000,
      end: 1630005600000 + new Date().getTimezoneOffset() * 60000,
    },
    {
      start: 1630005800000 + new Date().getTimezoneOffset() * 60000,
      end: 1630005900000 + new Date().getTimezoneOffset() * 60000,
    },
  ];
  expect(
    customVideoProgressBar({
      currentTimeIndicatorId: 'currentTimeIndicatorId',
      timelineId: 'timelineId',
      playProgressId: 'playProgressId',
      timerangesWithSource,
      timerangesForVideoOnEdge,
      startTimestamp: 1630005300000 + new Date().getTimezoneOffset() * 60000,
      endTimestamp: 1630005900000 + new Date().getTimezoneOffset() * 60000,
    })
  ).toEqual(expectedResult);
});
