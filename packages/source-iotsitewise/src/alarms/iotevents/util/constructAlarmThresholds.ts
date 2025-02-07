import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { ALARM_STATUS, ALARM_STATUS_MAP, AWSUI_RED_600 } from '../constants';
import { toId } from '../../../time-series-data/util/dataStreamId';
import { isNumber, isString } from '../../../common/predicates';
import type { Alarm, PascalCaseStateName } from '../types';
import type { Threshold } from '@iot-app-kit/core';
import { nanoid } from 'nanoid';

export const constructAlarmThresholds = (alarm: Alarm): Threshold[] => {
  const propertyStreamId = toId({
    assetId: alarm.assetId,
    propertyId: alarm.inputPropertyId,
  });
  const alarmStreamId = toId({
    assetId: alarm.assetId,
    propertyId: alarm.alarmStatePropertyId,
  });

  const upperCaseStateName =
    alarm.state.toUpperCase() as keyof typeof ALARM_STATUS;
  const state = ALARM_STATUS[upperCaseStateName];
  const alarmStatus = ALARM_STATUS_MAP[state];

  const inputPropertyThreshold = {
    comparisonOperator: alarm.comparisonOperator,
    severity: alarm.severity,
    value: isNumber(alarm.threshold)
      ? alarm.threshold
      : isString(alarm.threshold)
      ? parseFloat(alarm.threshold)
      : alarm.threshold,
    dataStreamIds: [propertyStreamId],
    color: AWSUI_RED_600,
    showValue: true,
    icon: alarmStatus.icon,
    description: alarm.rule,
    id: nanoid(),
  } satisfies Threshold;

  const alarmStatePropertyThresholds = Object.keys(ALARM_STATUS_MAP).map(
    (alarmStatus) => {
      const status = ALARM_STATUS_MAP[alarmStatus as PascalCaseStateName];

      return {
        value: alarmStatus,
        color: status.color,
        severity: status.severity,
        icon: status.icon,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: [alarmStreamId],
        description: alarm.rule,
        id: nanoid(),
      };
    }
  );

  return [inputPropertyThreshold, ...alarmStatePropertyThresholds];
};
