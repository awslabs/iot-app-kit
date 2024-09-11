import { AlarmData, AlarmDataStatus } from '../../../../hooks/useAlarms';
import { parseAlarmStateAssetProperty } from '../../../../hooks/useAlarms/transformers';
import {
  AlarmResource,
  AlarmResourceWithLatestValue,
} from '../../types/resources';

export const transformAlarmData = ({
  assetId,
  assetModelId,
  compositeModelId,
  compositeModelName,
  state,
  status,
  inputProperty,
}: AlarmData): {
  resource: Partial<AlarmResourceWithLatestValue>;
  status: AlarmDataStatus;
} => {
  const latestState = parseAlarmStateAssetProperty(state?.data?.at(-1));

  return {
    resource: {
      name: compositeModelName,
      assetCompositeModelId: compositeModelId,
      assetId,
      assetModelId,
      inputPropertyId: inputProperty?.at(0)?.id,
      inputPropertyName: inputProperty?.at(0)?.name,
      latestValue: latestState?.value.state,
      // default latest value timestamp renderer uses seconds as unit
      latestValueTimestamp: (latestState?.timestamp ?? 0) / 1000,
    },
    status,
  };
};

export const isAlarmResource = (
  alarmResourcePartial: Partial<AlarmResourceWithLatestValue>
): alarmResourcePartial is AlarmResource => {
  return (
    alarmResourcePartial.assetModelId != null &&
    alarmResourcePartial.assetCompositeModelId != null &&
    alarmResourcePartial.name != null
  );
};
