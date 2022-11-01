import { constructAlarmStreamData } from './constructAlarmStreamData';
import { ALARM_STATE_JSON_BLOB } from '../../../__mocks__/alarm';

it('should construct alarm stream data', () => {
  expect(
    constructAlarmStreamData({
      data: [
        {
          x: 1000000,
          y: JSON.stringify(ALARM_STATE_JSON_BLOB),
        },
      ],
    })
  ).toEqual([
    {
      x: 1000000,
      y: 'Active',
    },
  ]);
});
