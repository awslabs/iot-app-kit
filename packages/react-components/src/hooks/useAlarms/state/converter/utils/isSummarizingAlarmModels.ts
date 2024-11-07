import { type AlarmRequest } from '../../../types';
import { type AlarmRequestState } from '../../types';

export const isSummarizingAlarmModels = ({
  alarmDatas,
}: AlarmRequestState<AlarmRequest>) => {
  return alarmDatas.some(
    (data) => !!data.describeAlarmModelsQueryStatus?.isSuccess !== true
  );
};
