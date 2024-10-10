import { AlarmRequest } from '../../../types';
import { AlarmRequestState } from '../../types';

export const isSummarizingAlarmModels = ({
  alarmDatas,
}: AlarmRequestState<AlarmRequest>) => {
  return alarmDatas.some(
    (data) => !!data.describeAlarmModelsQueryStatus?.isSuccess !== true
  );
};
