import type { AlarmRequest } from '../../../types';
import type { AlarmRequestState } from '../../types';

export const isGettingLatestAlarmSourceValue = ({
  alarmDatas,
}: AlarmRequestState<AlarmRequest>) => {
  return alarmDatas.some(
    (data) => !data.getLatestAlarmSourceValueQueryStatus?.isSuccess
  );
};
