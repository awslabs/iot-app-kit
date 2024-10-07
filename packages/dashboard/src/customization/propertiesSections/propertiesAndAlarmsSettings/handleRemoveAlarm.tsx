import {
  AlarmQuery,
  SiteWiseAlarmAssetModelQuery,
} from '@iot-app-kit/source-iotsitewise';

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

export const handleRemoveAssetModelAlarms = (
  { alarmModels }: SiteWiseAlarmAssetModelQuery,
  {
    assetModelId,
    assetCompositeModelId,
  }: { assetModelId: string; assetCompositeModelId: string }
) => {
  return alarmModels
    .map((assetModel) => {
      if (assetModel.assetModelId !== assetModelId) return assetModel;
      const { alarmComponents } = assetModel;
      return {
        ...assetModel,
        alarmComponents: alarmComponents.filter(
          (alarmComponent) =>
            alarmComponent.assetCompositeModelId !== assetCompositeModelId
        ),
      };
    })
    .filter((assetModel) => assetModel.alarmComponents.length > 0);
};
