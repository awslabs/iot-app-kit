import { Cache } from './cache';
import { ALARM_MODEL, ALARM_MODEL_NAME, CACHED_ALARM_MODEL } from '../../__mocks__/alarm';
import { createMockIoTEventsSDK } from '../../__mocks__/ioteventsSDK';
import { EventsClient } from './client';

const initCache = ({ eventsApiOverride } = { eventsApiOverride: {} }) => {
  const client = new EventsClient(createMockIoTEventsSDK(eventsApiOverride));

  return new Cache(client);
};

it('should request alarm model from cache', async () => {
  const getAlarmModel = jest.fn().mockResolvedValue(ALARM_MODEL);

  const cache = initCache({ eventsApiOverride: { getAlarmModel } });

  expect(await cache.getAlarmModel(ALARM_MODEL_NAME)).toEqual(CACHED_ALARM_MODEL);
  expect(await cache.getAlarmModel(ALARM_MODEL_NAME)).toEqual(CACHED_ALARM_MODEL);

  expect(getAlarmModel).toHaveBeenCalledTimes(1);
});

it('should throw if simple rule is empty', async () => {
  const getAlarmModel = jest.fn().mockResolvedValue({
    ...ALARM_MODEL,
    alarmRule: {},
  });

  const cache = initCache({ eventsApiOverride: { getAlarmModel } });

  await expect(cache.getAlarmModel(ALARM_MODEL_NAME)).rejects.toThrow();
});

it('should throw if alarm model is missing severity', async () => {
  const getAlarmModel = jest.fn().mockResolvedValue({
    ...ALARM_MODEL,
    severity: undefined,
  });

  const cache = initCache({ eventsApiOverride: { getAlarmModel } });

  await expect(cache.getAlarmModel(ALARM_MODEL_NAME)).rejects.toThrow();
});

it.each(['inputProperty', 'comparisonOperator', 'threshold'])(
  'should throw if simple rule is missing %s',
  async (ruleConfig) => {
    const getAlarmModel = jest.fn().mockResolvedValue({
      ...ALARM_MODEL,
      alarmRule: {
        ...ALARM_MODEL.alarmRule,
        simpleRule: {
          ...ALARM_MODEL.alarmRule?.simpleRule,
          [ruleConfig]: undefined,
        },
      },
      [ruleConfig]: undefined,
    });

    const cache = initCache({ eventsApiOverride: { getAlarmModel } });

    await expect(cache.getAlarmModel(ALARM_MODEL_NAME)).rejects.toThrow();
  }
);
