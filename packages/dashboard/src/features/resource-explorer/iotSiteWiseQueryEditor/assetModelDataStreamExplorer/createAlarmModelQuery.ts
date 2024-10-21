import { AlarmExplorerProps } from '@iot-app-kit/react-components';
import { SiteWiseAlarmAssetModelQuery } from '@iot-app-kit/source-iotsitewise';

export const createAlarmModelQuery = ({
  assetModelId,
  assetId,
  alarms,
}: {
  assetModelId: string;
  alarms: NonNullable<AlarmExplorerProps['selectedAlarms']>;
  assetId?: string;
}): SiteWiseAlarmAssetModelQuery['alarmModels'] => [
  {
    assetModelId: assetModelId,
    assetIds: assetId ? [assetId] : [],
    alarmComponents: alarms.map(({ assetCompositeModelId }) => ({
      assetCompositeModelId,
    })),
  },
];
