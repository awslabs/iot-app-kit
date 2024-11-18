import { type AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';
import { type AlarmCompositeModelRequest } from '../../hooks/useAlarms';

export const convertAlarmQueryToAlarmRequest = (
  alarmQuery: AlarmDataQuery
): AlarmCompositeModelRequest[] => {
  return (
    alarmQuery.query.alarms?.reduce((results, alarm) => {
      alarm.alarmComponents.map((component) => {
        results.push({
          assetId: alarm.assetId,
          assetCompositeModelId: component.assetCompositeModelId,
        });
      });
      return results;
    }, [] as AlarmCompositeModelRequest[]) ?? []
  );
};
