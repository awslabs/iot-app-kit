import { AlarmRequest } from '../../../types';
import { AlarmRequestState } from '../../types';

export const isGettingLatestAlarmSourceValue = ({
  alarmDatas,
}: AlarmRequestState<AlarmRequest>) => {
  return alarmDatas.some(
    (data) => !!data.getLatestAlarmSourceValueQueryStatus?.isSuccess !== true
  );
};
