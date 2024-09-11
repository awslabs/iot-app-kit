import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { ALARM_STATUS } from '../constants';
import { toTimestamp } from '../../../utils/time';

export type UpperCaseStateName = keyof typeof ALARM_STATUS;
export type PascalCaseStateName = (typeof ALARM_STATUS)[UpperCaseStateName];

export const parseAlarmStateAssetProperty = (
  assetPropertyValue?: AssetPropertyValue
) => {
  if (assetPropertyValue == null) {
    return undefined;
  }

  const { timestamp, quality, value } = assetPropertyValue;

  const alarmStateJSON = value?.stringValue;

  if (alarmStateJSON == null) {
    return undefined;
  }

  try {
    const { stateName } = JSON.parse(alarmStateJSON);

    let normalizedStateName: PascalCaseStateName;

    if (ALARM_STATUS[stateName as UpperCaseStateName] != null) {
      normalizedStateName = ALARM_STATUS[stateName as UpperCaseStateName];
    } else {
      normalizedStateName = stateName;
    }

    return {
      quality,
      timestamp: toTimestamp(timestamp),
      value: {
        state: normalizedStateName,
      },
    };
  } catch (err) {
    throw new Error(`Could not parse alarm data: ${err}`);
  }
};
