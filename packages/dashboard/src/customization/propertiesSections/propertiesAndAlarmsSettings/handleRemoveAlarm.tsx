import { AlarmQuery } from '@iot-app-kit/source-iotsitewise';

export const handleRemoveAlarm = (
  { alarms }: { alarms: AlarmQuery[] },
  {
    assetId,
    assetCompositeModelId,
  }: { assetId: string; assetCompositeModelId: string }
) => {
  return alarms
    .map((alarm) => {
      if (alarm.assetId !== assetId) return alarm;
      const { alarmComponents } = alarm;
      return {
        ...alarm,
        alarmComponents: alarmComponents.filter(
          (comp) => comp.assetCompositeModelId !== assetCompositeModelId
        ),
      };
    })
    .filter((alarm) => alarm.alarmComponents.length > 0);
};
