import { createNonNullableList } from '../../../../utils/createNonNullableList';
import { AlarmData, AlarmRequest } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';
import { AlarmRequestState } from '../types';

export const convertAlarmRequestStateToInitialAlarmData = (
  alarmRequestState: AlarmRequestState<AlarmRequest>
): AlarmData[] => {
  return [
    {
      assetId: alarmRequestState.request.assetId,
      assetModelId: alarmRequestState.request.assetModelId,
      compositeModelId: alarmRequestState.request.assetCompositeModelId,
      /**
       * Status will combine the first 4 queries
       * because we will not know which alarm an input
       * property query will be associated to until
       * the describe alarm models query has completed.
       * Until then, we will map those request types
       * as initial alarm data using the combined
       * status from all queries.
       */
      status: combineStatusForQueries(
        createNonNullableList([
          alarmRequestState.describeAssetModelQueryStatus,
          alarmRequestState.describeAssetQueryStatus,
          ...alarmRequestState.alarmDatas.map(
            (alarmData) => alarmData.getLatestAlarmSourceValueQueryStatus
          ),
          ...alarmRequestState.alarmDatas.map(
            (alarmData) => alarmData.getLatestAlarmTypeValueQueryStatus
          ),
          ...alarmRequestState.alarmDatas.map(
            (alarmData) => alarmData.describeAlarmModelsQueryStatus
          ),
        ])
      ),
    },
  ];
};
