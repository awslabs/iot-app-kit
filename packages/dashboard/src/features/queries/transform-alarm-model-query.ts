import {
  type AlarmAssetModelQuery,
  type SiteWiseAlarmQuery,
} from '@iot-app-kit/source-iotsitewise';
import unionBy from 'lodash-es/unionBy';
import uniq from 'lodash-es/uniq';
import { type IoTSiteWiseDataStreamQuery } from '~/features/queries/queries';

type AlarmModelQueryWithAssetId = Required<AlarmAssetModelQuery>;
const alarmModelWithAssetId = (
  alarmModelQuery: AlarmAssetModelQuery
): alarmModelQuery is AlarmModelQueryWithAssetId =>
  alarmModelQuery.assetIds != null && alarmModelQuery.assetIds.length > 0;

const alarmModelQueryToAlarmQuery = (
  alarmModelQuery: AlarmModelQueryWithAssetId
) =>
  alarmModelQuery.assetIds.map((assetId) => ({
    assetId,
    alarmComponents: alarmModelQuery.alarmComponents,
  }));

const combineAlarms = (
  alarmsA: SiteWiseAlarmQuery['alarms'],
  alarmsB: SiteWiseAlarmQuery['alarms']
) => {
  const assetIds = uniq([...alarmsA, ...alarmsB].map(({ assetId }) => assetId));
  return assetIds.map((assetId) => {
    const foundA = alarmsA.find((alarm) => alarm.assetId === assetId);
    const foundB = alarmsB.find((alarm) => alarm.assetId === assetId);

    if (foundA && foundB) {
      return {
        ...foundA,
        alarmComponents: unionBy(
          foundA.alarmComponents,
          foundB.alarmComponents,
          'assetCompositeModelId'
        ),
      };
    }

    // assetIds is the combined list of a and b, one must be defined;
    return (foundA ?? foundB) as SiteWiseAlarmQuery['alarms'][number];
  });
};

export const alarmModelQueryToSiteWiseAssetQuery = ({
  alarmModels = [],
  alarms = [],
}: Pick<IoTSiteWiseDataStreamQuery, 'alarms' | 'alarmModels'>) => {
  const alarmModelQueriesWithAssetId = alarmModels.filter(
    alarmModelWithAssetId
  );

  const mappedAssetModelQuery = alarmModelQueriesWithAssetId.flatMap(
    alarmModelQueryToAlarmQuery
  );

  return combineAlarms(alarms, mappedAssetModelQuery);
};
