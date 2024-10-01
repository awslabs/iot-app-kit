import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { ALARM_STATUS } from '../constants';
import { toTimestamp } from '../../../utils/time';

export type UpperCaseStateName = keyof typeof ALARM_STATUS;
export type PascalCaseStateName = (typeof ALARM_STATUS)[UpperCaseStateName];

export const isAlarmState = (state?: string): state is PascalCaseStateName => {
  if (state == null) return false;
  return Object.values(ALARM_STATUS).includes(state as PascalCaseStateName);
};

type SiteWiseRuleEvaluation = {
  simpleRule?: {
    inputProperty?: number;
    operator?: string;
    threshold?: number;
  };
};

export const isRuleEvaluation = (
  ruleEvaluation?: unknown
): ruleEvaluation is SiteWiseRuleEvaluation => {
  return (
    ruleEvaluation != null &&
    typeof ruleEvaluation === 'object' &&
    (ruleEvaluation as SiteWiseRuleEvaluation).simpleRule != null &&
    (ruleEvaluation as SiteWiseRuleEvaluation).simpleRule?.inputProperty != null
  );
};

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
    const { stateName, ruleEvaluation } = JSON.parse(alarmStateJSON);

    let normalizedStateName: PascalCaseStateName;

    if (ALARM_STATUS[stateName as UpperCaseStateName] != null) {
      normalizedStateName = ALARM_STATUS[stateName as UpperCaseStateName];
    } else {
      normalizedStateName = stateName;
    }

    let normalizedRuleEvaluation = undefined;
    if (isRuleEvaluation(ruleEvaluation)) {
      normalizedRuleEvaluation = ruleEvaluation;
    }

    return {
      quality,
      timestamp: toTimestamp(timestamp),
      value: {
        state: normalizedStateName,
        ruleEvaluation: normalizedRuleEvaluation,
      },
    };
  } catch (err) {
    throw new Error(`Could not parse alarm data: ${err}`);
  }
};
